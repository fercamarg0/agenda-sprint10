import { PrismaClient } from '@prisma/client';
import { cleanDatabase } from './_clean';
import { seedIndependentEntities } from './01-independent';
import { seedUsers } from './02-users';
import { seedBusinesses } from './03-businesses';
import { seedCrossRelations } from './04-relations';
import { seedDependentData } from './05-dependents';
import { seedAdditionalEntities } from './06-additional-entities';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando o processo de seed modularizado...');

  // 1. Limpa o banco de dados
  await cleanDatabase(prisma);

  // 2. Cria entidades que não dependem de nada
  await seedIndependentEntities(prisma);

  // 3. Cria usuários e retorna um mapa para referência
  const usersMap = await seedUsers(prisma);

  // 4. Cria empresas, associa proprietários e retorna mapas de referência
  const { businessesMap, rolesMap } = await seedBusinesses(prisma, usersMap);

  // 5. Cria as relações de exemplo entre usuários e empresas
  await seedCrossRelations(prisma, usersMap, businessesMap, rolesMap);

  // 6. Cria os dados que dependem de usuários e empresas
  await seedDependentData(prisma, usersMap);

  // 7. Cria entidades adicionais para desenvolvimento completo
  await seedAdditionalEntities(prisma, usersMap, businessesMap);

  console.log('🎉 Seed modularizado EXPANDIDO concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Ocorreu um erro durante o processo de seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Desconectando o Prisma Client...');
    await prisma.$disconnect();
  });
