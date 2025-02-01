import { PaginationParams } from '../utils/types.js';
import prisma from '../utils/database.client.js';
import { CreateRiderDto } from './DTOs/rider.dto.js';
import SystemConflictException from '../exceptions/system.conflict.exception.js';
import { hashPassword } from '../utils/security.utils.js';
import { UserType } from '@prisma/client';

class RiderService {
  findAllRiders = async ({ page, size }: PaginationParams) => {
    const count = await prisma.rider.count();

    const riders = await prisma.rider.findMany({
      skip: (page - 1) * size,
      take: size,
    });

    return {
      riders,
      currentPage: page,
      itemsPerPage: riders.length,
      totalItems: count,
      totalPages: count / size,
    };
  };

  findRiderById = async (id: string) => {
    return prisma.rider.findFirst({ where: { id } });
  };

  createRider = async (createRiderDto: CreateRiderDto) => {
    return prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({ where: { email: createRiderDto.email } });
      if (existingUser) {
        throw new SystemConflictException('Email already registered');
      }

      const hashedPassword = await hashPassword(createRiderDto.password);

      const user = await tx.user.create({
        data: {
          email: createRiderDto.email,
          password: hashedPassword,
          userType: UserType.RIDER,
          firstName: createRiderDto.firstName,
          lastName: createRiderDto.lastName,
          gender: createRiderDto.gender,
          phoneNumber: createRiderDto.phoneNumber,
          dateOfBirth: new Date(createRiderDto.dateOfBirth),
          nationalId: createRiderDto.nationalId,
          city: createRiderDto.city,
          state: createRiderDto.state,
        },
      });

      const rider = await tx.rider.create({
        data: {
          userId: user.id,
        },
      });

      return { ...user, ...rider };
    });
  };

  deleteRider = async (id: string) => {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data: { isDeleted: true } });
      await tx.rider.update({ where: { id }, data: { isDeleted: true } });
    });
  };
}

export default new RiderService();
