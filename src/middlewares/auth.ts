import { Request, Response, NextFunction } from 'express';
import AuthenticationException from '../exceptions/authentication.exception.js';
import { decodeToken, isTokenRevoked } from '../utils/security.utils.js';
import { UserType } from '@prisma/client';

export default function auth(allowedRoles: UserType[] | UserType) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new AuthenticationException('Unauthorized'));
      }

      const [bearer, token] = req.headers.authorization!.split(' ');
      if (bearer != 'Bearer' || !token) {
        return next(new AuthenticationException('Token not valid'));
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        next(new AuthenticationException('Invalid token'));
      }

      const isRevoked = await isTokenRevoked(decodedToken!.jti);
      if (isRevoked) {
        next(new AuthenticationException('Unauthorized, token revoked'));
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      const hasAllowedRole = decodedToken!.roles.some((role) => roles.includes(role as UserType));
      if (!hasAllowedRole) {
        next(new AuthenticationException('Unauthorized'));
      }

      req.user = {
        id: decodedToken!.sub!,
        roles: decodedToken!.roles,
      };

      next();
    } catch (error) {
      next(new AuthenticationException('Unauthorized'));
    }
  };
}
