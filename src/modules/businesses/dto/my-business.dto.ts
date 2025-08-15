import { BusinessStatus, EntityType } from "@prisma/client";
export class MyBusinessDto {
  id: string;
  entityType: EntityType;
  displayName: string;
  cpf: string | null;
  cnpj: string | null;
  legalName: string | null;
  tradeName: string | null;
  email: string;
  phone: string | null;
  logo: string | null;
  status: BusinessStatus;
  addressId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
