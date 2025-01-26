import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PaginatedResponse } from '../utils/types.js';
import driverService from './driver.service.js';

class DriverController {

  findDrivers = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    try {
      const { drivers, currentPage, itemsPerPage, totalItems, totalPages } = await driverService.findAllDrivers({
        page,
        size,
      });

      res.status(StatusCodes.OK).json(new PaginatedResponse(
        drivers,
        {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages,
        },
      ));
      return;
    } catch (error) {
      next(error);
    }
  };

  findDriverById = async (req: Request, res: Response, next: NextFunction) => {
    const { driverId } = req.params;
    try {
      const driver = await driverService.findDriverById(driverId);

      res.status(StatusCodes.OK).json({ driver });
      return;
    } catch (error) {
      next(error);
    }
  };
}

export default new DriverController();