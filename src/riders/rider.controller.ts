import { Request, Response, NextFunction } from 'express';
import riderService from './rider.service.js';
import { PaginatedResponse, PaginationParams } from '../utils/types.js';
import { StatusCodes } from 'http-status-codes';
import { CreateRiderDto, UpdateRiderDto } from './DTOs/rider.dto.js';

class RiderController {

  findRiders = async (req: Request<{}, {}, {}, PaginationParams>, res: Response, next: NextFunction) => {
    try {
      const { riders, currentPage, itemsPerPage, totalItems, totalPages } = await riderService.findAllRiders(req.query);

      return res.status(StatusCodes.OK).json(new PaginatedResponse(
        riders,
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

  findRiderById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const rider = await riderService.findRiderById(id);

      return res.status(StatusCodes.OK).json({ rider });
    } catch (error) {
      next(error);
    }
  };

  createRider = async (req: Request<{}, {}, CreateRiderDto>, res: Response, next: NextFunction) => {
    try {
      const createdRider = await riderService.createRider(req.body);

      return res.status(StatusCodes.CREATED).json({ createdRider });
    } catch (error) {
      next(error);
    }
  };

  updateRider = async (req: Request<{}, {}, UpdateRiderDto>, res: Response, next: NextFunction) => {
    try {
      const updatedRider = await riderService.updateRider(req.body);

      return res.status(StatusCodes.OK).json({ updatedRider });
    } catch (error) {
      next(error);
    }
  };

  deleteRider = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await riderService.deleteRider(id);

      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

}

export default new RiderController();