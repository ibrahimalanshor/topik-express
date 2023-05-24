import jwt from 'jsonwebtoken';

export async function generateToken(
  secret: string,
  payload: any,
  options?: { expire: string }
): Promise<string> {
  return await jwt.sign(payload, secret, {
    expiresIn: options?.expire,
  });
}
