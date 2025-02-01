import prisma from '../utils/database.client.js';
import { PaginationParams } from '../utils/types.js';
import { CreateDriverDto } from './DTOs/driver.dto.js';
import SystemConflictException from '../exceptions/system.conflict.exception.js';
import { hashPassword } from '../utils/security.utils.js';
import { UserType } from '@prisma/client';

class DriverService {
  findAllDrivers = async ({ page, size }: PaginationParams) => {
    const count = await prisma.driver.count();

    const drivers = await prisma.driver.findMany({
      skip: (page - 1) * size,
      take: size,
    });

    return {
      drivers,
      currentPage: page,
      itemsPerPage: drivers.length,
      totalItems: count,
      totalPages: Math.ceil(count / size),
    };
  };

  findDriverById = async (id: string) => {
    return prisma.driver.findFirst({ where: { id } });
  };

  createDriver = async (createDriverDto: CreateDriverDto) => {
    return prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({ where: { email: createDriverDto.email } });
      if (existingUser) {
        throw new SystemConflictException('Email already registered');
      }

      const hashedPassword = await hashPassword(createDriverDto.password);

      const user = await tx.user.create({
        data: {
          email: createDriverDto.email,
          password: hashedPassword,
          userType: UserType.DRIVER,
          firstName: createDriverDto.firstName,
          lastName: createDriverDto.lastName,
          gender: createDriverDto.gender,
          phoneNumber: createDriverDto.phoneNumber,
          dateOfBirth: new Date(createDriverDto.dateOfBirth),
          nationalId: createDriverDto.nationalId,
          city: createDriverDto.city,
          state: createDriverDto.state,
        },
      });

      const driver = await tx.driver.create({
        data: {
          licenseNumber: createDriverDto.licenseNumber,
          userId: user.id,
        },
      });

      return { ...user, ...driver };
    });
  };

  deleteDriver = async (id: string) => {
    return prisma.$transaction(async (tx) => {
      await tx.driver.update({ where: { id }, data: { isDeleted: true } });
      await tx.user.update({ where: { id }, data: { isDeleted: true } });
    });
  };
}

export default new DriverService();
