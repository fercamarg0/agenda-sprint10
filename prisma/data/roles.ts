/**
 * Dados de exemplo para roles (perfis de acesso)
 */

export interface RoleSeed {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  active: boolean;
}

export const roles: RoleSeed[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'owner',
    description: 'Dono da empresa',
    permissions: [
      'create:employee',
      'read:employee',
      'update:employee',
      'delete:employee',
      'create:service',
      'read:service',
      'update:service',
      'delete:service',
      'create:customer',
      'read:customer',
      'update:customer',
      'delete:customer',
      'create:appointment',
      'read:appointment',
      'update:appointment',
      'delete:appointment',
      'read:user',
      'update:user',
      'read:role',
      'update:business',
      'read:business',
      'read:subscription',
      'update:subscription',
    ],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'employee',
    description: 'Funcionário comum',
    permissions: [
      'read:employee',
      'read:service',
      'create:customer',
      'read:customer',
      'update:customer',
      'create:appointment',
      'read:appointment',
      'update:appointment',
      'read:user',
    ],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'admin',
    description: 'Administrador global',
    permissions: ['*'],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'manager',
    description: 'Gerente da empresa',
    permissions: [
      'create:employee',
      'read:employee',
      'update:employee',
      'create:service',
      'read:service',
      'update:service',
      'create:customer',
      'read:customer',
      'update:customer',
      'create:appointment',
      'read:appointment',
      'update:appointment',
      'delete:appointment',
      'read:user',
      'read:business',
    ],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'receptionist',
    description: 'Recepcionista',
    permissions: [
      'read:employee',
      'read:service',
      'create:customer',
      'read:customer',
      'create:appointment',
      'read:appointment',
      'update:appointment',
    ],
    active: true,
  },
];

export const getRoleIdByName = (name: string): string => {
  const role = roles.find(r => r.name === name);
  if (!role) {
    throw new Error(`Role ${name} não encontrada!`);
  }
  return role.id;
};
