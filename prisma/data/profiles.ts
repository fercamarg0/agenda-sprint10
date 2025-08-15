/**
 * Dados de exemplo para perfis de usuários
 */
import { randomBirthDate } from '../utils/dates';

export interface ProfileSeed {
  userId: string;
  fullName: string;
  phone: string;
  birthDate: Date;
  avatarUrl?: string;
}

export const profiles: ProfileSeed[] = [
  // Admin global
  {
    userId: '550e8400-e29b-41d4-a716-446655442000',
    fullName: 'Administrador do Sistema',
    phone: '(11) 98888-8888',
    birthDate: new Date('1990-01-01'),
  },
  
  // Perfis da empresa 1 - Salão Beleza Total
  {
    userId: '550e8400-e29b-41d4-a716-446655442001',
    fullName: 'Ana Oliveira',
    phone: '(11) 97777-7777',
    birthDate: new Date('1985-05-10'),
    avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    userId: '550e8400-e29b-41d4-a716-446655442002',
    fullName: 'Carla Mendes',
    phone: '(11) 97777-1234',
    birthDate: new Date('1988-07-15'),
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    userId: '550e8400-e29b-41d4-a716-446655442003',
    fullName: 'Roberta Santos',
    phone: '(11) 96666-6666',
    birthDate: new Date('1995-10-20'),
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  
  // Perfis da empresa 2 - Barbearia Vintage
  {
    userId: '550e8400-e29b-41d4-a716-446655442004',
    fullName: 'Ricardo Gomes',
    phone: '(11) 95555-5555',
    birthDate: new Date('1982-03-25'),
    avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    userId: '550e8400-e29b-41d4-a716-446655442005',
    fullName: 'Juliana Martins',
    phone: '(11) 94444-4444',
    birthDate: new Date('1992-11-05'),
    avatarUrl: 'https://randomuser.me/api/portraits/women/57.jpg',
  },
  
  // Perfis da empresa 3 - Studio de Tatuagem InkArt
  {
    userId: '550e8400-e29b-41d4-a716-446655442006',
    fullName: 'Carlos Silva',
    phone: '(11) 93333-3333',
    birthDate: new Date('1987-09-12'),
    avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  
  // Perfis da empresa 4 - Clínica Fisio & Saúde
  {
    userId: '550e8400-e29b-41d4-a716-446655442007',
    fullName: 'Dra. Patrícia Almeida',
    phone: '(11) 92222-2222',
    birthDate: new Date('1975-12-15'),
    avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    userId: '550e8400-e29b-41d4-a716-446655442008',
    fullName: 'Dr. Lucas Fernandes',
    phone: '(11) 91111-1111',
    birthDate: new Date('1983-04-22'),
    avatarUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    userId: '550e8400-e29b-41d4-a716-446655442009',
    fullName: 'Mariana Costa',
    phone: '(11) 90000-0000',
    birthDate: new Date('1990-08-30'),
    avatarUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
  
  // Perfil da empresa 5 - Personal Trainer João Fitness
  {
    userId: '550e8400-e29b-41d4-a716-446655442010',
    fullName: 'João Oliveira',
    phone: '(11) 99999-0001',
    birthDate: new Date('1988-02-10'),
    avatarUrl: 'https://randomuser.me/api/portraits/men/25.jpg',
  },
];

/**
 * Função para criar um perfil aleatório para um usuário
 * @param userId ID do usuário
 * @returns ProfileSeed
 */
export function createRandomProfile(userId: string): ProfileSeed {
  const firstNames = ['Maria', 'João', 'Ana', 'Pedro', 'Juliana', 'Carlos', 'Fernanda', 'Lucas', 'Amanda', 'Rafael'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Lima', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  // Gerar telefone aleatório
  const ddd = Math.floor(Math.random() * 89) + 11; // DDD entre 11 e 99
  const part1 = Math.floor(Math.random() * 9000) + 1000;
  const part2 = Math.floor(Math.random() * 9000) + 1000;
  const phone = `(${ddd}) 9${part1}-${part2}`;
  
  const genderMap = {
    'Maria': 'women',
    'Ana': 'women',
    'Juliana': 'women',
    'Fernanda': 'women',
    'Amanda': 'women',
    'João': 'men',
    'Pedro': 'men',
    'Carlos': 'men',
    'Lucas': 'men',
    'Rafael': 'men',
  };
  
  const gender = genderMap[firstName] || 'men';
  const avatarNumber = Math.floor(Math.random() * 70) + 1;
  
  return {
    userId,
    fullName,
    phone,
    birthDate: randomBirthDate(),
    avatarUrl: `https://randomuser.me/api/portraits/${gender}/${avatarNumber}.jpg`,
  };
}
