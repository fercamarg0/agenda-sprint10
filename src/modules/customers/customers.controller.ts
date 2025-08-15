import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../shared/helpers/interfaces/request-with-user.interface";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { FindCustomersDto } from "./dto/find-customers.dto";
@Controller("customers")
@UseGuards(AuthGuard("jwt"))
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() req: RequestWithUser,
  ) {
    createCustomerDto.businessId = req.user.businessId;
    return this.customersService.create(createCustomerDto);
  }
  @Get()
  findAll(
    @Query() findCustomersDto: FindCustomersDto,
    @Req() req: RequestWithUser,
  ) {
    return this.customersService.findAll(
      req.user.businessId,
      findCustomersDto,
      req,
    );
  }
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.customersService.findOne(id, req.user.businessId);
  }
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() req: RequestWithUser,
  ) {
    return this.customersService.update(
      id,
      req.user.businessId,
      updateCustomerDto,
    );
  }
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.customersService.remove(id, req.user.businessId);
  }
}
