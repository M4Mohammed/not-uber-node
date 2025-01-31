import { PaginationParams } from '../utils/types.js';
import prisma from '../utils/database.client.js';
import { CreateRiderDto, UpdateRiderDto } from './DTOs/rider.dto.js';
import SystemConflictException from '../exceptions/system.conflict.exception.js';
import { hashPassword } from '../utils/security.utils.js';

class RiderService {
  findAllRiders = async ({ page = 1, size = 10 }: PaginationParams) => {
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
      const emailExists = await tx.rider.findFirst({ where: { email: createRiderDto.email } });
      if (emailExists) {
        throw new SystemConflictException('Email already registered');
      }

      const phoneNumberExists = await tx.rider.findFirst({ where: { phoneNumber: createRiderDto.phoneNumber } });
      if (phoneNumberExists) {
        throw new SystemConflictException('Phone number already registered');
      }

      const hashedPassword = await hashPassword(createRiderDto.password);

      return tx.rider.create({
        data: { ...createRiderDto, password: hashedPassword },
      });
    });
  };

  updateRider = async (updateRiderDto: UpdateRiderDto) => {
    return prisma.$transaction(async (tx) => {
      const emailExists = await tx.rider.findFirst({ where: { email: updateRiderDto.email } });
      if (emailExists) {
        throw new SystemConflictException('Email already registered');
      }

      const phoneNumberExists = await tx.rider.findFirst({ where: { phoneNumber: updateRiderDto.phoneNumber } });
      if (phoneNumberExists) {
        throw new SystemConflictException('Phone number already registered');
      }

      return tx.rider.update({
        where: { id: updateRiderDto.id },
        data: updateRiderDto,
      });
    });
  };

  //todo: soft delete rider
  deleteRider = async (id: string) => {
    return prisma.rider.delete({ where: { id } });
  };
}

export default new RiderService();
