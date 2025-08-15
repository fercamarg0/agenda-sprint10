import { PrismaClient, User, Business } from '@prisma/client';

/**
 * Seeds additional entities that enhance the development experience
 * including Colors, Credits, etc.
 * @param prisma The PrismaClient instance.
 * @param usersMap A Map of created users.
 * @param businessesMap A Map of created businesses.
 */
export async function seedAdditionalEntities(
  prisma: PrismaClient,
  usersMap: Map<string, User>,
  businessesMap: Map<string, Business>,
) {
  console.log('🎨 Criando entidades adicionais (Colors, Credits, etc.)...');

  // Get first business and owner for reference
  const firstBusiness = Array.from(businessesMap.values())[0];
  const firstUser = Array.from(usersMap.values())[0];

  if (!firstBusiness || !firstUser) {
    console.warn('   - ⚠️ Nenhuma empresa ou usuário encontrado. Pulando entidades adicionais.');
    return;
  }

  // Get a valid UserBusiness ID for foreign key references (e.g., createdBy)
  const firstUserBusiness = await prisma.userBusiness.findFirst({
    where: { businessId: firstBusiness.id },
  });

  if (!firstUserBusiness) {
    console.warn(
      '   - ⚠️ Nenhuma associação UserBusiness encontrada. Pulando entidades adicionais.',
    );
    return;
  }

  // --- 1. Colors ---
  console.log('   🎨 Criando cores...');
  const colors = [
    { name: 'Azul Principal', hexCode: '#007bff' },
    { name: 'Verde Sucesso', hexCode: '#28a745' },
    { name: 'Vermelho Alerta', hexCode: '#dc3545' },
  ];

  for (const color of colors) {
    await prisma.color.create({ data: color });
  }
  console.log(`   - ${colors.length} cores criadas.`);

  // --- 2. Credits ---
  console.log('   💰 Criando créditos de exemplo...');

  // Find a customer to assign the credit to.
  const firstCustomer = await prisma.customer.findFirst({
    where: { businessId: firstBusiness.id },
  });

  if (!firstCustomer) {
    console.warn(
      '   - ⚠️ Nenhum cliente encontrado para o primeiro negócio. Pulando a criação de créditos.',
    );
  } else {
    const creditsToCreate = [
      {
        amount: 50.0,
        notes: 'Crédito de boas-vindas para o primeiro cliente.',
        status: 'AVAILABLE' as const,
      },
      {
        amount: 100.0,
        notes: 'Vale presente de R$ 100 para tratamentos estéticos.',
        status: 'AVAILABLE' as const,
      },
    ];

    let createdCount = 0;
    for (const creditData of creditsToCreate) {
      const credit = await prisma.credit.create({
        data: {
          businessId: firstBusiness.id,
          customerId: firstCustomer.id,
          initialAmount: creditData.amount,
          balance: creditData.amount,
          status: creditData.status,
          notes: creditData.notes,
          createdBy: firstUserBusiness.id, // Corrected from createdById
        },
      });

      // Create the initial GRANT transaction
      await prisma.creditTransaction.create({
        data: {
          creditId: credit.id,
          type: 'GRANT',
          amount: credit.initialAmount,
          balanceBefore: 0,
          balanceAfter: credit.balance,
          notes: 'Concessão inicial de crédito via seed.',
          processedBy: firstUserBusiness.id,
        },
      });
      createdCount++;
    }
    // Corrected from firstCustomer.name to firstCustomer.displayName
    console.log(
      `   - ${createdCount} créditos criados para o cliente: ${firstCustomer.displayName}.`,
    );
  }

  // --- 3. Working Hours ---
  console.log('   ⏰ Criando horários de funcionamento...');
  const workingHours = [
    {
      businessId: firstBusiness.id,
      userBusinessId: firstUserBusiness.id,
      dayOfWeek: 1, // Segunda
      startTime: '08:00',
      endTime: '18:00',
    },
    {
      businessId: firstBusiness.id,
      userBusinessId: firstUserBusiness.id,
      dayOfWeek: 2, // Terça
      startTime: '08:00',
      endTime: '18:00',
    },
  ];

  for (const wh of workingHours) {
    await prisma.workingHour.create({ data: wh });
  }
  console.log(`   - ${workingHours.length} registros de horário de funcionamento criados.`);

  console.log('✅ Entidades adicionais criadas com sucesso!');
}
