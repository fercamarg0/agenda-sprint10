import { applyDecorators } from "@nestjs/common";
import { IsEnum, ValidateIf, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export function IsEnumField(
  enumObject: any,
  options: { optional?: boolean } = {},
) {
  const decorators = [IsEnum(enumObject)];

  if (options.optional) {
    decorators.push(IsOptional());
  }

  return applyDecorators(...decorators);
}

export function IsOptionalEnumField(enumObject: any) {
  return IsEnumField(enumObject, { optional: true });
}
