import { randomUUID } from 'crypto';

/**
 * Dados de exemplo para clientes das empresas
 */
import { randomBirthDate } from '../utils/dates';

import { EntityType } from '@prisma/client';

export interface CustomerSeed {
  id: string;
  businessId: string;
  displayName: string;
  customerType: EntityType;
  email?: string;
  phone: string;
  birthDate?: Date;
}

/**
 * Função para criar clientes aleatórios para uma empresa
 * @param businessId ID da empresa
 * @param count Quantidade de clientes a serem criados
 * @returns Array de CustomerSeed
 */
export function createCustomersForBusiness(businessId: string, count: number = 10): CustomerSeed[] {
  const customers: CustomerSeed[] = [];
  
  const firstNames = ['Maria', 'João', 'Ana', 'Pedro', 'Juliana', 'Carlos', 'Fernanda', 'Lucas', 'Amanda', 'Rafael',
                      'Mariana', 'Gabriel', 'Camila', 'Daniel', 'Patrícia', 'Ricardo', 'Laura', 'Bruno', 'Renata', 'Eduardo',
                      'Bianca', 'Gustavo', 'Natália', 'Henrique', 'Carolina', 'Leonardo', 'Isabela', 'Miguel', 'Letícia', 'André'];
                      
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Lima', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida',
                     'Nascimento', 'Carvalho', 'Gomes', 'Martins', 'Araújo', 'Ribeiro', 'Fernandes', 'Cavalcanti', 'Mendes', 'Cardoso'];

  const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const displayName = `${firstName} ${lastName}`;
    
    // Gerar email (70% dos clientes têm email)
    let email: string | undefined = undefined;
    if (Math.random() > 0.3) {
      const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`;
    }
    
    // Gerar telefone aleatório
    const ddd = Math.floor(Math.random() * 89) + 11; // DDD entre 11 e 99
    const part1 = Math.floor(Math.random() * 9000) + 1000;
    const part2 = Math.floor(Math.random() * 9000) + 1000;
    const phone = `(${ddd}) 9${part1}-${part2}`;
    
    // Gerar data de nascimento (80% dos clientes têm data de nascimento)
    const birthDate = Math.random() > 0.2 ? randomBirthDate() : undefined;
    
    customers.push({
      id: randomUUID(),
      businessId,
      displayName: displayName,
      customerType: 'PERSON',
      email,
      phone,
      birthDate,
    });
  }
  
  return customers;
}
