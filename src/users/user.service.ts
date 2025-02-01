import prisma from '../utils/database.client.js';

class UserService {
  findByEmail = async (email: string) => {
    return prisma.user.findFirst({ where: { email } });
  };
}

export default new UserService();
