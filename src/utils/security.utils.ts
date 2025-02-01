import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { DecodedToken } from './types.js';
import { UserType } from '@prisma/client';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return argon2.verify(hashedPassword, plainPassword);
};

export const hashPassword = async (plainPassword: string) => {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 12288,
    timeCost: 3,
    parallelism: 1,
  });
};

export const generateToken = (sub: string, userType: UserType, refreshTokenVersion: number) => {
  const accessToken = jwt.sign(
    {
      sub,
      userType,
    },
    process.env.JWT_SECRET!,
    { expiresIn: 60 * 60 },
  );

  const refreshToken = jwt.sign(
    {
      sub,
      userType,
      version: refreshTokenVersion,
    },
    process.env.JWT_SECRET!,
    { expiresIn: 60 * 60 * 24 * 7 },
  );

  return { accessToken, refreshToken };
};

export const decodeToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
};

export const blackListToken = async (jti: string) => {
  await redis.set(jti, 'revoked', { EX: 60 * 60 * 24 * 7 });
};

export const isTokenRevoked = async (jti: string) => {
  const result = await redis.get(jti);
  return result === 'revoked';
};
