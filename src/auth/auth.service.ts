import { LoginDto } from './DTOs/auth.dto.js';
import NoSuchItemException from '../exceptions/no.such.item.exception.js';
import { generateToken, verifyPassword } from '../utils/security.utils.js';
import AuthenticationException from '../exceptions/authentication.exception.js';
import userService from '../users/user.service.js';

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
}

export default new AuthService();
