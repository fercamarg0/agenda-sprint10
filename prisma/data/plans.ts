import { Plan, Prisma } from '@prisma/client';

export const plans: Partial<Plan>[] = [
  {
    id: '1e6f3b8a-95b7-4c1f-8d3a-1b9c8d7e6f5a',
    name: 'Básico',
    price: new Prisma.Decimal('29.90'),
    features: ['Até 3 membros', 'Agendamento online'],
  },
  {
    id: '2e6f3b8a-95b7-4c1f-8d3a-1b9c8d7e6f5b',
    name: 'Profissional',
    price: new Prisma.Decimal('59.90'),
    features: ['Até 10 membros', 'Agendamento online', 'Relatórios'],
  },
  {
    id: '3e6f3b8a-95b7-4c1f-8d3a-1b9c8d7e6f5c',
    name: 'Empresarial',
    price: new Prisma.Decimal('99.90'),
    features: ['Membros ilimitados', 'Agendamento online', 'Relatórios', 'Suporte prioritário'],
  },
];
