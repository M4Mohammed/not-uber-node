import { NextFunction, Request, Response } from 'express';
import driverService from './driver.service.js';
import { StatusCodes } from 'http-status-codes';
import { PaginatedResponse } from '../utils/types.js';

class DriverController {

  findDrivers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    try {
      const { drivers, currentPage, itemsPerPage, totalItems, totalPages } = await driverService.findAllDrivers({
        page,
        size,
      });

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

  findDriverById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { driverId } = req.params;
    try {
      const driver = await driverService.findDriverById(driverId);

      return res.status(StatusCodes.OK).json({ driver });
    } catch (error) {
      next(error);
    }
  };
}

export default new DriverController();