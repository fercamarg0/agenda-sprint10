/**
 * Dados de exemplo para planos de assinatura
 */
import { futureDate } from '../utils/dates';

export interface SubscriptionPlanSeed {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  active: boolean;
}

export const subscriptionPlans: SubscriptionPlanSeed[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655444000',
    name: 'Plano Básico',
    description: 'Plano básico com funcionalidades limitadas',
    price: 49.90,
    currency: 'BRL',
    features: [
      'Até 1 usuário',
      'Até 50 clientes',
      'Até 10 serviços',
      'Agendamentos ilimitados',
    ],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655444001',
    name: 'Plano Profissional',
    description: 'Plano ideal para pequenos negócios',
    price: 99.90,
    currency: 'BRL',
    features: [
      'Até 3 usuários',
      'Até 200 clientes',
      'Até 30 serviços',
      'Agendamentos ilimitados',
      'Relatórios básicos',
    ],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655444002',
    name: 'Plano Premium',
    description: 'Plano completo para negócios em crescimento',
    price: 199.90,
    currency: 'BRL',
    features: [
      'Até 10 usuários',
      'Clientes ilimitados',
      'Serviços ilimitados',
      'Agendamentos ilimitados',
      'Relatórios avançados',
      'Notificações SMS',
    ],
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655444003',
    name: 'Plano Enterprise',
    description: 'Plano para grandes empresas',
    price: 349.90,
    currency: 'BRL',
    features: [
      'Usuários ilimitados',
      'Clientes ilimitados',
      'Serviços ilimitados',
      'Agendamentos ilimitados',
      'Relatórios avançados',
      'Notificações SMS',
      'API exclusiva',
      'Suporte prioritário',
    ],
    active: true,
  },
];

export interface BusinessSubscriptionSeed {
  id: string;
  businessId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
}

export const createBusinessSubscription = (businessId: string, planId: string): BusinessSubscriptionSeed => {
  return {
    id: `${businessId}-${planId}`,
    businessId,
    planId,
    startDate: new Date(),
    endDate: futureDate(30),
    status: 'ACTIVE',
  };
};
