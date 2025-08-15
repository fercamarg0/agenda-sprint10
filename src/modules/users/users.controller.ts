import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { I18nService } from "nestjs-i18n";
import { AuthGuard } from "@nestjs/passport";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { PaginationQueryDto } from "../../shared/dto/pagination/pagination-query.dto";
import { Request } from "express";
import { ChangePasswordDto } from "./dto/change-password.dto";
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}
  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  // summary: 'Obter perfil do usuario atual',
  // operationId: 'getUserProfile',
  // status: 200,
  findMe(@Req() req: RequestWithUser) {
    const businessId = req.user.businessId;
    return this.usersService.findMe(req.user.sub, businessId);
  }
  @Patch("me/password")
  @UseGuards(AuthGuard("jwt"))
  // summary: 'Alterar senha do usuario atual',
  // operationId: 'changeCurrentUserPassword',
  // status: 401,
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user.sub, changePasswordDto);
    return {
      message: this.i18n.translate("users.change_password.success"),
    };
  }
}
