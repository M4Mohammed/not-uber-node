import jwt from 'jsonwebtoken';

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

export interface DecodedToken extends jwt.JwtPayload {
  userId: string;
  roles: string[];
  jti: string;
}
