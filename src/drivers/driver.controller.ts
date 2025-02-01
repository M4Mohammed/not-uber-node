import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PaginatedResponse, PaginationParams } from '../utils/types.js';
import driverService from './driver.service.js';
import { CreateDriverDto } from './DTOs/driver.dto.js';
import { any } from 'zod';

class DriverController {
  findDrivers = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    try {
      const {
        drivers,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
      } = await driverService.findAllDrivers({ page, size });

      return res.status(StatusCodes.OK).json(
        new PaginatedResponse(drivers, {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  findDriverById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const driver = await driverService.findDriverById(id);

      return res.status(StatusCodes.OK).json({ driver });
    } catch (error) {
      next(error);
    }
  };

  createDriver = async (req: Request<{}, {}, CreateDriverDto>, res: Response, next: NextFunction) => {
    try {
      const createdDriver = await driverService.createDriver(req.body);

      return res.status(StatusCodes.CREATED).json({ createdDriver });
    } catch (error) {
      next(error);
    }
  };

  deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await driverService.deleteDriver(id);

      return res.status(StatusCodes.NO_CONTENT).json({ message: 'Shit was deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default new DriverController();
