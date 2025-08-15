export interface AssociationSeed {
  userEmail: string;
  businessId: string;
  roleName: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export const associations: AssociationSeed[] = [
  // Owners
  {
    userEmail: 'owner.salon@example.com',
    businessId: '550e8400-e29b-41d4-a716-446655441000',
    roleName: 'OWNER',
  },
  {
    userEmail: 'owner.barber@example.com',
    businessId: '550e8400-e29b-41d4-a716-446655441001',
    roleName: 'OWNER',
  },
  {
    userEmail: 'owner.clinic@example.com',
    businessId: '550e8400-e29b-41d4-a716-446655441002',
    roleName: 'OWNER',
  },
  // Employees
  {
    userEmail: 'employee.salon@example.com',
    businessId: '550e8400-e29b-41d4-a716-446655441000',
    roleName: 'MEMBER',
  },
  {
    userEmail: 'employee.barber@example.com',
    businessId: '550e8400-e29b-41d4-a716-446655441001',
    roleName: 'MEMBER',
  },
  {
    userEmail: 'admin.clinic@example.com',
    businessId: '550e8400-e29b-41d4-a716-446655441002',
    roleName: 'ADMIN',
  },
];
