import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { DecodedToken, Role } from './types.js';

export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return argon2.verify(plainPassword, hashedPassword);
};

export const hashPassword = async (plainPassword: string) => {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 47104,
    timeCost: 1,
    parallelism: 1,
  });
};

//todo: add refresh token
export const generateToken = (sub: string, role: Role) => {
  return jwt.sign(
    {
      sub,
      role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: 60 * 60 },
  );
};

export const decodeToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
};
