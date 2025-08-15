import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../../../shared/helpers/interfaces/request-with-user.interface";
import { CustomerNotesService } from "./customer-notes.service";
import { CreateCustomerNoteDto } from "./dto/create-customer-note.dto";
import { FindCustomerNotesDto } from "./dto/find-customer-notes.dto";
import { Request } from "express";
@Controller("customers/:customerId/notes")
@UseGuards(AuthGuard("jwt"))
export class CustomerNotesController {
  constructor(private readonly customerNotesService: CustomerNotesService) {}
  @Post()
  create(
    @Req() req: RequestWithUser,
    @Param("customerId", ParseUUIDPipe) customerId: string,
    @Body() createCustomerNoteDto: CreateCustomerNoteDto,
  ) {
    createCustomerNoteDto.businessId = req.user.businessId;
    createCustomerNoteDto.customerId = customerId;
    return this.customerNotesService.create(createCustomerNoteDto);
  }
  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Param("customerId", ParseUUIDPipe) customerId: string,
    @Query() findCustomerNotesDto: FindCustomerNotesDto,
  ) {
    return this.customerNotesService.findAll(
      customerId,
      req.user.businessId,
      findCustomerNotesDto,
      req as unknown as Request,
    );
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.customerNotesService.remove(id, req.user.businessId);
  }
}
