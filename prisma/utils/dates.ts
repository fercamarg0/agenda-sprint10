/**
 * Funções utilitárias para lidar com datas
 */

/**
 * Cria uma data no passado com base no número de dias
 * @param days Número de dias no passado
 * @returns Date
 */
export function pastDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Cria uma data no futuro com base no número de dias
 * @param days Número de dias no futuro
 * @returns Date
 */
export function futureDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Cria uma data aleatória entre duas datas
 * @param start Data inicial
 * @param end Data final
 * @returns Date
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Cria uma data de nascimento aleatória para uma pessoa adulta (18-60 anos)
 * @returns Date
 */
export function randomBirthDate(): Date {
  const today = new Date();
  const minAge = 18;
  const maxAge = 60;
  
  const minYear = today.getFullYear() - maxAge;
  const maxYear = today.getFullYear() - minAge;
  
  const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1; // Simplificado para evitar problemas com meses diferentes
  
  return new Date(year, month, day);
}
