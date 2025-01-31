import prisma from '../utils/database.client.js';
import { PaginationParams } from '../utils/types.js';
import { CreateDriverDto, UpdateDriverDto } from './DTOs/driver.dto.js';
import SystemConflictException from '../exceptions/system.conflict.exception.js';
import { hashPassword } from '../utils/security.utils.js';

class DriverService {
  findAllDrivers = async ({ page = 1, size = 10 }: PaginationParams) => {
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
      const emailExists = await tx.driver.findFirst({ where: { email: createDriverDto.email } });
      if (emailExists) {
        throw new SystemConflictException('Email already registered');
      }

      const phoneNumberExists = await tx.driver.findFirst({ where: { phoneNumber: createDriverDto.phoneNumber } });
      if (phoneNumberExists) {
        throw new SystemConflictException('Phone number already registered');
      }

      const hashedPassword = await hashPassword(createDriverDto.password);

      return tx.driver.create({
        data: { ...createDriverDto, password: hashedPassword },
      });
    });
  };

  updateDriver = async (updateDriverDto: UpdateDriverDto) => {
    return prisma.$transaction(async (tx) => {
      const emailExists = await tx.driver.findFirst({ where: { email: updateDriverDto.email } });
      if (emailExists) {
        throw new SystemConflictException('Email already registered');
      }

      const phoneNumberExists = await tx.driver.findFirst({ where: { phoneNumber: updateDriverDto.phoneNumber } });
      if (phoneNumberExists) {
        throw new SystemConflictException('Phone number already registered');
      }

      return tx.driver.update({ where: { id: updateDriverDto.id }, data: updateDriverDto });
    });
  };

  deleteDriver = async (id: string) => {
    return prisma.driver.update({ where: { id }, data: { isDeleted: true } });
  };
}

export default new DriverService();
