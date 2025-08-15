import { PartialType } from "@nestjs/mapped-types";
import { RegisterCommissionPaymentDto } from "./register-commission-payment.dto";
export class UpdateCommissionPaymentDto extends PartialType(
  RegisterCommissionPaymentDto,
) {}
