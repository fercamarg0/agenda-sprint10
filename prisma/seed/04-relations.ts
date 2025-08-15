import {
  PrismaClient,
  UserBusinessStatus,
  User,
  Business,
  BusinessRole,
} from '@prisma/client';

/**
 * Creates explicit cross-associations between users and businesses for demo purposes.
 * For example, making the owner of one business a member of another.
 * This seeder depends on users and businesses having been created.
 * @param prisma The PrismaClient instance.
 * @param usersMap A Map of created users.
 * @param businessesMap A Map of created businesses.
 * @param rolesMap A Map of business roles.
 */
export async function seedCrossRelations(
  prisma: PrismaClient,
  usersMap: Map<string, User>,
  businessesMap: Map<string, Business>,
  rolesMap: Map<string, BusinessRole>,
) {
  console.log('🔗 Criando associações cruzadas entre usuários e empresas...');

  // Encontrar usuários específicos para cenários de teste
  const adminUser = usersMap.get('admin@agendapower.com');
  const mariaOwner = usersMap.get('maria.silva@bellavista.com');
  const anaEmployee = usersMap.get('ana.santos@bellavista.com');
  const drRicardoOwner = usersMap.get('dr.ricardo@clinicapremium.com');
  const pedroEmployee = usersMap.get('pedro.tecnico@clinicapremium.com');
  const juliaInfluencer = usersMap.get('julia.beauty@instagram.com');

  // Encontrar empresas específicas
  const bellaVista = Array.from(businessesMap.values()).find(
    (b) => b.displayName === 'Salão Bella Vista',
  );
  const clinicaPremium = Array.from(businessesMap.values()).find(
    (b) => b.displayName === 'Clínica Estética Premium',
  );

  const ownerRole = rolesMap.get('OWNER');
  const memberRole = rolesMap.get('MEMBER');
  const adminRole = rolesMap.get('ADMIN');

  if (ownerRole && memberRole && adminRole && bellaVista && clinicaPremium) {
    // 1. Super Admin - criar business próprio para ter acesso
    if (adminUser) {
      const adminBusiness = await prisma.business.create({
        data: {
          displayName: 'AgendaPower Admin',
          email: 'admin@agendapower.com',
          entityType: 'CORPORATION',
        },
      });
      
      const adminUserBusiness = await prisma.userBusiness.create({
        data: {
          userId: adminUser.id,
          businessId: adminBusiness.id,
          businessRoleId: ownerRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
      
      // Criar preferences para admin
      await prisma.userPreferences.create({
        data: {
          userId: adminUser.id,
          defaultBusinessId: adminBusiness.id,
        },
      });
      
      console.log('   - Super Admin associado ao business AgendaPower Admin');
    }

    // 2. Ana Santos como funcionária do Salão Bella Vista
    if (anaEmployee && bellaVista) {
      const anaUserBusiness = await prisma.userBusiness.create({
        data: {
          userId: anaEmployee.id,
          businessId: bellaVista.id,
          businessRoleId: adminRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
      
      // Criar preferences para Ana
      await prisma.userPreferences.create({
        data: {
          userId: anaEmployee.id,
          defaultBusinessId: bellaVista.id,
        },
      });
      
      console.log('   - Ana Santos associada como funcionária do Salão Bella Vista');
    }

    // 3. Pedro Técnico como funcionário da Clínica Premium
    if (pedroEmployee && clinicaPremium) {
      const pedroUserBusiness = await prisma.userBusiness.create({
        data: {
          userId: pedroEmployee.id,
          businessId: clinicaPremium.id,
          businessRoleId: adminRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
      
      // Criar preferences para Pedro
      await prisma.userPreferences.create({
        data: {
          userId: pedroEmployee.id,
          defaultBusinessId: clinicaPremium.id,
        },
      });
      
      console.log('   - Pedro Técnico associado como funcionário da Clínica Premium');
    }

    // 4. Júlia Beauty como membro/parceira do Salão Bella Vista (influencer partnership)
    if (juliaInfluencer && bellaVista) {
      const juliaUserBusiness = await prisma.userBusiness.create({
        data: {
          userId: juliaInfluencer.id,
          businessId: bellaVista.id,
          businessRoleId: memberRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
      
      // Criar preferences para Júlia
      await prisma.userPreferences.create({
        data: {
          userId: juliaInfluencer.id,
          defaultBusinessId: bellaVista.id,
        },
      });
      
      console.log('   - Júlia Beauty associada como parceira do Salão Bella Vista');
    }

    // 5. Criar preferences para Dr. Ricardo (já tem UserBusiness como owner)
    if (drRicardoOwner && clinicaPremium) {
      await prisma.userPreferences.create({
        data: {
          userId: drRicardoOwner.id,
          defaultBusinessId: clinicaPremium.id,
        },
      });
      console.log('   - Preferences criadas para Dr. Ricardo');
    }

    // 6. Maria Silva como membro da Clínica Premium (parceria entre negócios)
    if (mariaOwner && clinicaPremium) {
      await prisma.userBusiness.create({
        data: {
          userId: mariaOwner.id,
          businessId: clinicaPremium.id,
          businessRoleId: memberRole.id,
          status: UserBusinessStatus.ACCEPTED,
        },
      });
      console.log('   - Maria Silva associada como parceira da Clínica Premium');
    }
  } else {
    console.warn(
      '   - ⚠️ AVISO: Não foi possível criar as associações: roles ou empresas não encontrados.',
    );
  }

  console.log('✅ Associações cruzadas criadas com sucesso.');
}
