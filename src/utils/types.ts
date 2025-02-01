import jwt from 'jsonwebtoken';
import { z } from 'zod';

export interface PaginationParams {
  page: number;
  size: number;
}

export class PaginatedResponse<T> {
  constructor(
    public data: T[],
    public pagination: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    },
  ) {}
}

export const PaginationSchema = z.object({
  query: z.object({
    page: z.string().transform(Number),
    size: z.string().transform(Number),
  }),
});

export interface DecodedToken extends jwt.JwtPayload {
  userId: string;
  roles: string[];
  jti: string;
}
