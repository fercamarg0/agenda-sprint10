import { randomUUID } from 'crypto';

/**
 * Dados de exemplo para serviços das empresas
 */

export interface ServiceSeed {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // minutos
  active: boolean;
  category?: string;
  createdById: string;
  updatedById: string;
}

export const createServicesForBusiness = (
  businessId: string,
  creatorId: string,
): ServiceSeed[] => {
  const genericServices: Omit<ServiceSeed, 'createdById' | 'updatedById'>[] = [
    {
      id: randomUUID(),
      businessId,
      name: 'Serviço de Consulta',
      description: 'Consulta inicial para avaliação de necessidades.',
      price: 100.0,
      duration: 30,
      active: true,
    },
    {
      id: randomUUID(),
      businessId,
      name: 'Serviço Básico',
      description: 'Execução de serviço padrão.',
      price: 150.0,
      duration: 60,
      active: true,
    },
    {
      id: randomUUID(),
      businessId,
      name: 'Serviço Premium',
      description: 'Serviço completo com atendimento exclusivo.',
      price: 250.0,
      duration: 90,
      active: true,
    },
  ];

  return genericServices.map((service) => ({
    ...service,
    createdById: creatorId,
    updatedById: creatorId,
  }));
};
