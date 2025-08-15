interface BusinessSeed {
  id: string;
  name: string;
  ownerEmail: string;
}

export const businesses: BusinessSeed[] = [
  // 💄 Salão de Beleza Bella Vista (Proprietária: Maria Silva)
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d470',
    name: 'Salão Bella Vista',
    ownerEmail: 'maria.silva@bellavista.com',
  },
  
  // 🏥 Clínica Estética Premium (Proprietário: Dr. Ricardo)
  {
    id: 'a1b2c3d4-5678-9012-3456-789012345678',
    name: 'Clínica Estética Premium',
    ownerEmail: 'dr.ricardo@clinicapremium.com',
  },
];
