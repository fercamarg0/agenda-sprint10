import {
  PrismaClient,
  EntityType,
  UserBusinessStatus,
  User,
  BusinessRole,
} from '@prisma/client';
import { businesses } from '../data/businesses';

/**
 * Seeds businesses and assigns their owners.
 * This seeder depends on the users having been created already.
 * @param prisma The PrismaClient instance.
 * @param usersMap A Map of created users, keyed by email.
 * @returns A Map of created businesses and a Map of business roles for subsequent seeders.
 */
export async function seedBusinesses(
  prisma: PrismaClient,
  usersMap: Map<string, User>,
) {
  console.log('🏢 Criando empresas e associando proprietários...');

  const businessesMap = new Map<string, any>();
  const createdBusinessRoles = await prisma.businessRole.findMany();
  const rolesMap = new Map<string, BusinessRole>(
    createdBusinessRoles.map((r) => [r.name, r]),
  );
  const ownerRole = rolesMap.get('OWNER');

  if (!ownerRole) {
    throw new Error(
      'O perfil "OWNER" não foi encontrado. O seed não pode continuar.',
    );
  }

  for (const businessData of businesses) {
    // 1. Create the business
    const createdBusiness = await prisma.business.create({
      data: {
        id: businessData.id,
        displayName: businessData.name,
        entityType: EntityType.CORPORATION,
        email: `${businessData.name.replace(/\s+/g, '').toLowerCase()}@example.com`,
      },
    });
    businessesMap.set(createdBusiness.id, createdBusiness);

    // 2. Find the owner from the usersMap and associate them
    const ownerUser = usersMap.get(businessData.ownerEmail);
    if (ownerUser) {
      await prisma.userBusiness.create({
        data: {
          userId: ownerUser.id,
          businessId: createdBusiness.id,
          businessRoleId: ownerRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
    } else {
      console.warn(
        `   - ⚠️ AVISO: Proprietário ${businessData.ownerEmail} não encontrado para a empresa ${businessData.name}. Associação não criada.`,
      );
    }
  }

  console.log(`    > ${businesses.length} empresas criadas e proprietários associados.`);
  console.log('✅ Empresas criadas com sucesso.');

  return { businessesMap, rolesMap };
}
