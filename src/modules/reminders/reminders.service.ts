import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateReminderListDto } from "./dto/create-reminder-list.dto";
import { UpdateReminderListDto } from "./dto/update-reminder-list.dto";
import { CreateReminderItemDto } from "./dto/create-reminder-item.dto";
import { UpdateReminderItemDto } from "./dto/update-reminder-item.dto";
import {
  QueryReminderItemsDto,
  ItemFilterType,
} from "./dto/query-reminder-items.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { PaginationService } from "../../shared/services/pagination.service";
import { Request } from "express";
@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async createList(userId: string, dto: CreateReminderListDto) {
    const lastList = await this.prisma.reminderList.findFirst({
      where: { userId },
      orderBy: { displayOrder: "desc" },
    });
    const newOrder = lastList ? lastList.displayOrder + 1 : 0;
    return this.prisma.reminderList.create({
      data: {
        ...dto,
        userId,
        displayOrder: newOrder,
      },
    });
  }
  async findAllListsByUserId(userId: string) {
    const lists = await this.prisma.reminderList.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        color: true,
        priority: true,
        displayOrder: true,
        _count: {
          select: { items: { where: { isCompleted: false } } },
        },
      },
    });
    return lists.map((list) => ({
      id: list.id,
      title: list.title,
      color: list.color,
      priority: list.priority,
      displayOrder: list.displayOrder,
      itemsCount: list._count.items,
    }));
  }
  async findListById(userId: string, listId: string) {
    const list = await this.prisma.reminderList.findFirst({
      where: {
        id: listId,
        userId,
      },
      include: {
        items: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });
    if (!list) {
      throw new NotFoundException(
        "Reminder list not found or does not belong to the user.",
      );
    }
    return list;
  }
  async updateList(userId: string, listId: string, dto: UpdateReminderListDto) {
    await this.findListById(userId, listId);
    return this.prisma.reminderList.update({
      where: { id: listId },
      data: dto,
    });
  }
  async deleteList(userId: string, listId: string) {
    await this.findListById(userId, listId);
    return this.prisma.reminderList.delete({
      where: { id: listId },
    });
  }
  async findItemsByUserId(
    userId: string,
    queryDto: QueryReminderItemsDto,
    request: Request,
  ) {
    const { listId, filter, search, priority, isCompleted } = queryDto;
    const where: Prisma.ReminderItemWhereInput = {
      list: {
        userId,
      },
    };
    if (listId) {
      where.listId = listId;
    }
    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted === "true";
    }
    if (priority) {
      where.priority = priority;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }
    if (filter) {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      switch (filter) {
        case ItemFilterType.TODAY:
          where.dueDate = { gte: startOfDay, lte: endOfDay };
          break;
        case ItemFilterType.SCHEDULED:
          where.dueDate = { gte: startOfDay };
          break;
        case ItemFilterType.COMPLETED:
          if (where.isCompleted === undefined) {
            where.isCompleted = true;
          }
          break;
      }
    }
    const include = {
      list: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
    };
    const orderBy = [
      { dueDate: "asc" },
      { priority: "desc" },
      { createdAt: "desc" },
    ];
    const searchableFields = ["title", "notes"];
    return this.paginationService.paginate(
      "reminderItem",
      queryDto,
      {
        where,
        include,
        orderBy,
      },
      searchableFields,
      request,
    );
  }
  async createItem(userId: string, listId: string, dto: CreateReminderItemDto) {
    const list = await this.prisma.reminderList.findFirst({
      where: { id: listId, userId },
    });
    if (!list) {
      throw new NotFoundException(
        "Lista não encontrada ou não pertence ao usuário",
      );
    }
    const lastItem = await this.prisma.reminderItem.findFirst({
      where: { listId },
      orderBy: { displayOrder: "desc" },
    });
    const newOrder = lastItem ? lastItem.displayOrder + 1 : 0;
    const data: Prisma.ReminderItemCreateInput = {
      ...dto,
      displayOrder: newOrder,
      user: {
        connect: {
          id: userId,
        },
      },
      list: {
        connect: {
          id: listId,
        },
      },
    };
    if (dto.dueDate) {
      data.dueDate = new Date(dto.dueDate);
    }
    return this.prisma.reminderItem.create({ data });
  }
  async findItemById(userId: string, itemId: string) {
    const item = await this.prisma.reminderItem.findFirst({
      where: {
        id: itemId,
        list: { userId },
      },
      include: {
        list: {
          select: {
            id: true,
            title: true,
            priority: true,
            color: true,
          },
        },
      },
    });
    if (!item) {
      throw new NotFoundException(
        "Item não encontrado ou não pertence ao usuário",
      );
    }
    return {
      id: item.id,
      title: item.title,
      notes: item.notes,
      dueDate: item.dueDate,
      priority: item.priority,
      isCompleted: item.isCompleted,
      displayOrder: item.displayOrder,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      list: {
        id: item.list.id,
        title: item.list.title,
        color: item.list.color,
      },
    };
  }
  async updateItem(userId: string, itemId: string, dto: UpdateReminderItemDto) {
    const item = await this.prisma.reminderItem.findFirst({
      where: {
        id: itemId,
        list: { userId },
      },
    });
    if (!item) {
      throw new NotFoundException(
        "Item não encontrado ou não pertence ao usuário",
      );
    }
    const data: Prisma.ReminderItemUpdateInput = { ...dto };
    if (dto.dueDate) {
      data.dueDate = new Date(dto.dueDate);
    }
    return this.prisma.reminderItem.update({
      where: { id: itemId },
      data,
    });
  }
  async toggleItemCompletion(userId: string, itemId: string) {
    const item = await this.findItemById(userId, itemId);
    return this.prisma.reminderItem.update({
      where: { id: itemId },
      data: { isCompleted: !item.isCompleted },
    });
  }
  async deleteItem(userId: string, itemId: string) {
    const item = await this.prisma.reminderItem.findFirst({
      where: {
        id: itemId,
        list: { userId },
      },
    });
    if (!item) {
      throw new NotFoundException(
        "Item não encontrado ou não pertence ao usuário",
      );
    }
    return this.prisma.reminderItem.delete({
      where: { id: itemId },
    });
  }
  async getStatsByUserId(userId: string) {
    this.logger.log(`Fetching stats for user ${userId}`);
    try {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      const [todayCount, scheduledCount, allCount] = await Promise.all([
        this.prisma.reminderItem.count({
          where: {
            userId,
            isCompleted: false,
            dueDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        this.prisma.reminderItem.count({
          where: {
            userId,
            isCompleted: false,
            dueDate: { not: null },
          },
        }),
        this.prisma.reminderItem.count({
          where: {
            userId,
            isCompleted: false,
          },
        }),
      ]);
      return {
        today: todayCount,
        scheduled: scheduledCount,
        all: allCount,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to get stats for user ${userId}. Error: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `An unknown error occurred while fetching stats for user ${userId}.`,
          error,
        );
      }
      throw new InternalServerErrorException(
        "An error occurred while fetching reminder stats.",
      );
    }
  }
  async moveList(userId: string, listId: string, newOrder: number) {
    return this.prisma.$transaction(async (prisma) => {
      const totalLists = await prisma.reminderList.count({ where: { userId } });
      let effectiveNewOrder = newOrder;
      if (effectiveNewOrder < 0) effectiveNewOrder = 0;
      if (effectiveNewOrder >= totalLists) {
        effectiveNewOrder = totalLists - 1;
      }
      const listToMove = await prisma.reminderList.findFirst({
        where: { id: listId, userId },
      });
      if (!listToMove) {
        throw new NotFoundException(
          "Lista não encontrada ou não pertence ao usuário.",
        );
      }
      const currentOrder = listToMove.displayOrder;
      if (currentOrder === effectiveNewOrder) {
        return listToMove;
      }
      if (currentOrder < effectiveNewOrder) {
        await prisma.reminderList.updateMany({
          where: {
            userId,
            displayOrder: {
              gt: currentOrder,
              lte: effectiveNewOrder,
            },
          },
          data: {
            displayOrder: {
              decrement: 1,
            },
          },
        });
      } else {
        await prisma.reminderList.updateMany({
          where: {
            userId,
            displayOrder: {
              gte: effectiveNewOrder,
              lt: currentOrder,
            },
          },
          data: {
            displayOrder: {
              increment: 1,
            },
          },
        });
      }
      return prisma.reminderList.update({
        where: { id: listId },
        data: { displayOrder: effectiveNewOrder },
      });
    });
  }
  async moveItem(userId: string, itemId: string, newOrder: number) {
    return this.prisma.$transaction(async (prisma) => {
      const itemToMove = await prisma.reminderItem.findFirst({
        where: { id: itemId, userId },
      });
      if (!itemToMove) {
        throw new NotFoundException(
          "Item não encontrado ou não pertence ao usuário.",
        );
      }
      const listId = itemToMove.listId;
      const totalItemsInList = await prisma.reminderItem.count({
        where: { listId },
      });
      let effectiveNewOrder = newOrder;
      if (effectiveNewOrder < 0) effectiveNewOrder = 0;
      if (effectiveNewOrder >= totalItemsInList) {
        effectiveNewOrder = totalItemsInList - 1;
      }
      const currentOrder = itemToMove.displayOrder;
      if (currentOrder === effectiveNewOrder) {
        return itemToMove;
      }
      if (currentOrder < effectiveNewOrder) {
        await prisma.reminderItem.updateMany({
          where: {
            listId,
            displayOrder: {
              gt: currentOrder,
              lte: effectiveNewOrder,
            },
          },
          data: {
            displayOrder: {
              decrement: 1,
            },
          },
        });
      } else {
        await prisma.reminderItem.updateMany({
          where: {
            listId,
            displayOrder: {
              gte: effectiveNewOrder,
              lt: currentOrder,
            },
          },
          data: {
            displayOrder: {
              increment: 1,
            },
          },
        });
      }
      return prisma.reminderItem.update({
        where: { id: itemId },
        data: { displayOrder: effectiveNewOrder },
      });
    });
  }
}
