import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Address, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}
  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { address: true },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID "${userId}" not found`,
      );
    }
    return profile;
  }
  async updateByUserId(userId: string, dto: UpdateProfileDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        "At least one field must be provided to update.",
      );
    }
    const { address, ...profileData } = dto;
    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({ where: { userId } });
      if (!profile) {
        throw new NotFoundException(
          `Profile for user with ID "${userId}" not found`,
        );
      }
      if (Object.keys(profileData).length > 0) {
        const dataToUpdate: Prisma.ProfileUpdateInput = { ...profileData };
        if (dataToUpdate.birthDate) {
          dataToUpdate.birthDate = new Date(dataToUpdate.birthDate as string);
        }
        await tx.profile.update({ where: { userId }, data: dataToUpdate });
      }
      if (address && Object.keys(address).length > 0) {
        if (profile.addressId) {
          await tx.address.update({
            where: { id: profile.addressId },
            data: address,
          });
        } else {
          const newAddress: Address = await tx.address.create({
            data: address as Prisma.AddressCreateInput,
          });
          await tx.profile.update({
            where: { userId },
            data: { addressId: newAddress.id },
          });
        }
      }
      return tx.profile.findUnique({
        where: { userId },
        include: { address: true },
      });
    });
  }
  async getReferralStatsByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { referralCode: true },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID "${userId}" not found`,
      );
    }
    const referralsCount = await this.prisma.referral.count({
      where: { referrerId: userId },
    });
    return {
      referralCode: profile.referralCode,
      referralsCount,
    };
  }
}
