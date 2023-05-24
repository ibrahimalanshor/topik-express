import bcrypt from 'bcrypt';

export async function verifyPassword(
  plain: string,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(plain, password);
}
