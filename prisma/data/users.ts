import { SystemRole } from '@prisma/client';

interface UserProfileSeed {
  firstName: string;
  lastName: string;
  phone?: string;
}

interface UserSeed {
  id: string;
  email: string;
  password?: string;
  systemRole?: SystemRole;
  profile: UserProfileSeed;
}

export const users: UserSeed[] = [
  // 🔧 SUPER ADMIN - Administrador da Plataforma
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    email: 'admin@agendapower.com',
    password: 'Admin@123',
    systemRole: SystemRole.SUPER_ADMIN,
    profile: {
      firstName: 'Carlos',
      lastName: 'Administrador',
      phone: '(11) 99999-0001',
    },
  },

  // 👑 BUSINESS OWNER - Dono do Salão Bella Vista
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    email: 'maria.silva@bellavista.com',
    password: 'Owner@123',
    systemRole: SystemRole.USER,
    profile: {
      firstName: 'Maria',
      lastName: 'Silva',
      phone: '(11) 98765-4321',
    },
  },

  // 👩‍💼 EMPLOYEE - Funcionária do Salão Bella Vista
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    email: 'ana.santos@bellavista.com',
    password: 'Employee@123',
    systemRole: SystemRole.USER,
    profile: {
      firstName: 'Ana',
      lastName: 'Santos',
      phone: '(11) 97654-3210',
    },
  },

  // 🌟 INFLUENCER - Influenciadora de Beleza
  {
    id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    email: 'julia.beauty@instagram.com',
    password: 'Influencer@123',
    systemRole: SystemRole.USER,
    profile: {
      firstName: 'Júlia',
      lastName: 'Beauty',
      phone: '(11) 96543-2109',
    },
  },

  // 👑 BUSINESS OWNER - Dono da Clínica Estética Premium
  {
    id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    email: 'dr.ricardo@clinicapremium.com',
    password: 'Doctor@123',
    systemRole: SystemRole.USER,
    profile: {
      firstName: 'Dr. Ricardo',
      lastName: 'Oliveira',
      phone: '(11) 95432-1098',
    },
  },

  // 👨‍⚕️ EMPLOYEE - Funcionário da Clínica Premium
  {
    id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    email: 'pedro.tecnico@clinicapremium.com',
    password: 'Tech@123',
    systemRole: SystemRole.USER,
    profile: {
      firstName: 'Pedro',
      lastName: 'Técnico',
      phone: '(11) 94321-0987',
    },
  },
];
