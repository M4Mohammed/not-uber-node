import { Request, Response, NextFunction } from 'express';
import AuthenticationException from '../exceptions/authentication.exception.js';
import { decodeToken } from '../utils/security.utils.js';
import { Role } from '../utils/types.js';

export default function auth(allowedRoles: Role[] | Role) {
  return (req: Request, res: Response, next: NextFunction) => {
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

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      const hasAllowedRole = decodedToken!.roles.some((role) => roles.includes(role as Role));
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
