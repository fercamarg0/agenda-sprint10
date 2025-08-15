import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { RemindersService } from "./reminders.service";
import { CreateReminderListDto } from "./dto/create-reminder-list.dto";
import { UpdateReminderListDto } from "./dto/update-reminder-list.dto";
import { CreateReminderItemDto } from "./dto/create-reminder-item.dto";
import { UpdateReminderItemDto } from "./dto/update-reminder-item.dto";
import { QueryReminderItemsDto } from "./dto/query-reminder-items.dto";
import { Request } from "express";
@Controller("reminders")
@UseGuards(AuthGuard("jwt"))
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}
  @Post()
  createList(
    @Req() req: RequestWithUser,
    @Body() createDto: CreateReminderListDto,
  ) {
    return this.remindersService.createList(req.user.sub, createDto);
  }
  @Get()
  findAllLists(@Req() req: RequestWithUser) {
    return this.remindersService.findAllListsByUserId(req.user.sub);
  }
  @Get("items")
  findItems(
    @Req() req: RequestWithUser,
    @Query() queryDto: QueryReminderItemsDto,
  ) {
    return this.remindersService.findItemsByUserId(
      req.user.sub,
      queryDto,
      req as unknown as Request,
    );
  }
  @Get("stats")
  getStats(@Req() req: RequestWithUser) {
    return this.remindersService.getStatsByUserId(req.user.sub);
  }
  @Get(":listId")
  findOneList(
    @Req() req: RequestWithUser,
    @Param("listId", ParseUUIDPipe) listId: string,
  ) {
    return this.remindersService.findListById(req.user.sub, listId);
  }
  @Patch(":listId")
  updateList(
    @Req() req: RequestWithUser,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Body() updateDto: UpdateReminderListDto,
  ) {
    return this.remindersService.updateList(req.user.sub, listId, updateDto);
  }
  @Delete(":listId")
  removeList(
    @Req() req: RequestWithUser,
    @Param("listId", ParseUUIDPipe) listId: string,
  ) {
    return this.remindersService.deleteList(req.user.sub, listId);
  }
  @Post(":listId/items")
  createItem(
    @Req() req: RequestWithUser,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Body() createDto: CreateReminderItemDto,
  ) {
    return this.remindersService.createItem(req.user.sub, listId, createDto);
  }
  @Patch("items/:itemId")
  updateItem(
    @Req() req: RequestWithUser,
    @Param("itemId", ParseUUIDPipe) itemId: string,
    @Body() updateDto: UpdateReminderItemDto,
  ) {
    return this.remindersService.updateItem(req.user.sub, itemId, updateDto);
  }
  @Patch("items/:itemId/toggle")
  toggleItem(
    @Req() req: RequestWithUser,
    @Param("itemId", ParseUUIDPipe) itemId: string,
  ) {
    return this.remindersService.toggleItemCompletion(req.user.sub, itemId);
  }
  @Delete("items/:itemId")
  removeItem(
    @Req() req: RequestWithUser,
    @Param("itemId", ParseUUIDPipe) itemId: string,
  ) {
    return this.remindersService.deleteItem(req.user.sub, itemId);
  }
}
