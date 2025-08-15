import { PrismaClient, User, Business } from '@prisma/client';
import { businesses } from '../data/businesses';
import { createServicesForBusiness } from '../data/services';
import { createCustomersForBusiness } from '../data/customers';
import { createAppointmentsForBusiness } from '../data/appointments';

/**
 * Seeds data that is dependent on businesses and users, such as services,
 * customers, and appointments.
 * @param prisma The PrismaClient instance.
 * @param usersMap A Map of created users.
 * @param businessesMap A Map of created businesses.
 */
export async function seedDependentData(
  prisma: PrismaClient,
  usersMap: Map<string, User>,
) {
  console.log('📦 Criando dados dependentes (Serviços, Clientes, Agendamentos)...');

  for (const businessData of businesses) {
    const businessId = businessData.id;
    const ownerUser = usersMap.get(businessData.ownerEmail);

    if (!ownerUser) {
      console.warn(
        `   - ⚠️ AVISO: Proprietário ${businessData.ownerEmail} não encontrado para a empresa ${businessId}. Pulando criação de dados dependentes.`,
      );
      continue;
    }

    // --- Seed Services ---
    const services = createServicesForBusiness(businessId, ownerUser.id);
    const createdServices = await Promise.all(
      services.map((service) => prisma.service.create({ data: service })),
    );
    console.log(`   - ${createdServices.length} serviços criados para ${businessData.name}.`);

    // --- Seed Customers ---
    const customerCount = Math.floor(Math.random() * 15) + 5; // Create 5 to 20 customers
    const customers = createCustomersForBusiness(businessId, customerCount);
    const customerIds: string[] = [];
    for (const customer of customers) {
      const createdCustomer = await prisma.customer.create({ data: customer });
      customerIds.push(createdCustomer.id);
    }
    console.log(`   - ${customerIds.length} clientes criados para ${businessData.name}.`);

    // --- Seed Appointments ---
    // Find all users associated with the business to act as professionals
    const professionals = await prisma.userBusiness.findMany({
      where: { businessId: businessId },
      select: { id: true },
    });
    const professionalIds = professionals.map((p) => p.id);

    if (
      customerIds.length > 0 &&
      createdServices.length > 0 &&
      professionalIds.length > 0
    ) {
      const appointmentCount = Math.floor(Math.random() * 40) + 10; // 10 to 50 appointments
      const appointments = createAppointmentsForBusiness(
        businessId,
        customerIds,
        createdServices,
        professionalIds,
        appointmentCount,
      );
      for (const appointment of appointments) {
        await prisma.appointment.create({ data: appointment });
      }
      console.log(`   - ${appointments.length} agendamentos criados para ${businessData.name}.`);
    }
  }

  console.log('✅ Dados dependentes criados com sucesso.');
}
