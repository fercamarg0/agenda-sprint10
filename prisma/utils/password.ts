import * as bcrypt from 'bcrypt';

/**
 * Função para criar hash de senha
 * @param password Senha em texto plano
 * @returns Promise com a senha hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
