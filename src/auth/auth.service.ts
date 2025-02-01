import { LoginDto } from './DTOs/auth.dto.js';
import NoSuchItemException from '../exceptions/no.such.item.exception.js';
import { decodeToken, generateToken, verifyPassword } from '../utils/security.utils.js';
import AuthenticationException from '../exceptions/authentication.exception.js';
import userService from '../users/user.service.js';
import prisma from '../utils/database.client.js';

class AuthService {
  login = async (loginDto: LoginDto) => {
    const user = await userService.findByEmail(loginDto.email);
    if (!user) {
      throw new NoSuchItemException('User not found');
    }

    const isValidPassword = await verifyPassword(loginDto.password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationException('Invalid credentials');
    }

    return generateToken(user.id, user.userType, user.refreshTokenVersion!);
  };

  refreshToken = async (refreshToken: string) => {
    const { sub, version } = decodeToken(refreshToken)!;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: sub },
      select: {
        id: true,
        refreshTokenVersion: true,
        userType: true,
      },
    });
    if (user.refreshTokenVersion !== version) {
      throw new AuthenticationException('Invalid refresh token');
    }

    return generateToken(user.id, user.userType, user.refreshTokenVersion);
  };

  logoutFromAllDevices = async (refreshToken: string) => {
    const { sub } = decodeToken(refreshToken)!;

    await prisma.user.update({
      where: { id: sub },
      data: {
        refreshTokenVersion: { increment: 1 },
      },
    });
  };
}

export default new AuthService();
