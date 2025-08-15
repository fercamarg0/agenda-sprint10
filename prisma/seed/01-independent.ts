import { PrismaClient } from '@prisma/client';
import { businessRoles } from '../data/business-roles';
import { plans } from '../data/plans';

/**
 * Seeds independent entities that have no foreign key dependencies,
 * such as BusinessRoles and Plans.
 * @param prisma The PrismaClient instance.
 */
export async function seedIndependentEntities(prisma: PrismaClient) {
  console.log('🌱 Seeding independent entities (Roles & Plans)...');

  await prisma.businessRole.createMany({ data: businessRoles as any });
  console.log(`   - ${businessRoles.length} BusinessRoles created.`);

  await prisma.plan.createMany({ data: plans as any });
  console.log(`   - ${plans.length} subscription plans created.`);

  console.log('✅ Independent entities seeded successfully.');
}
