import prisma from '../utils/database.client.js';
import { PaginationParams } from '../utils/types.js';
import { CreateDriverDto, UpdateDriverDto } from './DTOs/driver.dto.js';

class DriverService {

  findAllDrivers = async ({ page, size }: PaginationParams) => {
    const count = await prisma.driver.count();

    const drivers = await prisma.driver.findMany({
      skip: ((page - 1) * size),
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
    return prisma.driver.create({ data: createDriverDto });
  };

  updateDriver = async (updateDriverDto: UpdateDriverDto) => {
    return prisma.driver.update({ where: { id: updateDriverDto.id }, data: updateDriverDto });
  };

  deleteDriver = async (id: string) => {
    return prisma.driver.delete({ where: { id } });
  };

}

export default new DriverService();