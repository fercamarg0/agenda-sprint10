import { PrismaClient, SystemRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { users } from '../data/users';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Seeds users and their profiles.
 * Hashes passwords before storing them.
 * @param prisma The PrismaClient instance.
 * @returns A Map of the created users, keyed by their email, to be used by subsequent seeders.
 */
export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Criando usuários e perfis...');

  const usersMap = new Map<string, any>();

  for (const userData of users) {
    // Use a default password if one isn't provided in the data file
    const plainPassword = userData.password || '123456';
    const hashedPassword = await hashPassword(plainPassword);

    const user = await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        password: hashedPassword,
        systemRole: userData.systemRole || SystemRole.USER,
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            fullName: `${userData.profile.firstName} ${userData.profile.lastName}`,
            phone: userData.profile.phone,
          },
        },
      },
    });
    usersMap.set(user.email, user);
  }

  console.log(`    > ${users.length} usuários e perfis criados.`);
  console.log('✅ Usuários criados com sucesso.');
  return usersMap;
}
