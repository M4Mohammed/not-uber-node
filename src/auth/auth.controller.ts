import { Request, Response, NextFunction } from 'express';
import { LoginDto } from './DTOs/auth.dto.js';
import authService from './auth.service.js';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  login = async (req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction) => {
    try {
      const tokens = await authService.login(req.body);

      return res.status(StatusCodes.OK).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    try {
      const tokens = await authService.refreshToken(refreshToken);

      return res.status(StatusCodes.OK).json(tokens);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
