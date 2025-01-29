import { PaginationParams } from '../utils/types.js';
import prisma from '../utils/database.client.js';
import { CreateRiderDto, UpdateRiderDto } from './DTOs/rider.dto.js';

class RiderService {

  findAllRiders = async ({ page = 1, size = 10 }: PaginationParams) => {
    const count = await prisma.rider.count();

    const riders = await prisma.rider.findMany({
      skip: ((page - 1) * size),
      take: size,
    });

    return {
      riders,
      currentPage: page,
      itemsPerPage: riders.length,
      totalItems: count,
      totalPages: (count / size),
    };
  };

  findRiderById = async (id: string) => {
    return prisma.rider.findFirst({ where: { id } });
  };

  createRider = async (createRiderDto: CreateRiderDto) => {
    return prisma.rider.create({ data: createRiderDto });
  };

  updateRider = async (updateRiderDto: UpdateRiderDto) => {
    return prisma.rider.update({ where: { id: updateRiderDto.id }, data: updateRiderDto });
  };

  deleteRider = async (id: string) => {
    return prisma.rider.delete({ where: { id } });
  };
}

export default new RiderService();