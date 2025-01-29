import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PaginatedResponse, PaginationParams } from '../utils/types.js';
import driverService from './driver.service.js';
import { CreateDriverDto, UpdateDriverDto } from './DTOs/driver.dto.js';

class DriverController {

  findDrivers = async (req: Request<{}, {}, {}, PaginationParams>, res: Response, next: NextFunction) => {
    try {
      const { drivers, currentPage, itemsPerPage, totalItems, totalPages } = await driverService.findAllDrivers(req.query);

      return res.status(StatusCodes.OK).json(new PaginatedResponse(
        drivers,
        {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages,
        },
      ));
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

  updateDriver = async (req: Request<{}, {}, UpdateDriverDto>, res: Response, next: NextFunction) => {
    try {
      const updatedDriver = await driverService.updateDriver(req.body);

      return res.status(StatusCodes.OK).json({ updatedDriver });
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