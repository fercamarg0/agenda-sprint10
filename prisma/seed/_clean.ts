import { PrismaClient } from '@prisma/client';

/**
 * Cleans the database by deleting records from all tables in the correct order
 * to avoid foreign key constraint violations.
 * @param prisma The PrismaClient instance.
 */
export async function cleanDatabase(prisma: PrismaClient) {
  console.log('🧹 Cleaning existing data...');

  // The order of deletion is crucial to respect foreign key constraints.
  // We start from the models that have dependencies (many-to-many or one-to-many relations)
  // and move towards the more independent ones.

  // Delete dependent entities first
  await prisma.auditLog.deleteMany({});
  await prisma.reminderItem.deleteMany({});
  await prisma.reminderList.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.notificationTemplate.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.workingHour.deleteMany({});
  await prisma.creditTransaction.deleteMany({});
  await prisma.credit.deleteMany({});
  await prisma.color.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.userBusiness.deleteMany({});
  await prisma.businessRole.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.plan.deleteMany({});

  console.log('✅ Database cleaned successfully.');
}
