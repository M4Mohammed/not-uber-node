import { LoginDto } from './DTOs/auth.dto.js';
import prisma from '../utils/database.client.js';
import NoSuchItemException from '../exceptions/no.such.item.exception.js';
import { generateToken, verifyPassword } from '../utils/security.utils.js';
import AuthenticationException from '../exceptions/authentication.exception.js';
import { Role } from '../utils/types.js';

class AuthService {
  login = async (loginDto: LoginDto) => {
    const result = await this.findByEmail(loginDto.email);
    if (!result) {
      throw new NoSuchItemException('User not found');
    }

    const { role, user } = result;

    const isValidPassword = await verifyPassword(loginDto.password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationException('Invalid credentials');
    }

    return generateToken(user.id, role);
  };

  private async findByEmail(email: string) {
    const [driver, rider] = await Promise.all([
      prisma.rider.findUnique({ where: { email } }),
      prisma.driver.findUnique({ where: { email } }),
    ]);

    if (driver) return { role: Role.Driver, user: driver };
    if (rider) return { role: Role.Rider, user: rider };

    return null;
  }
}

export default new AuthService();
