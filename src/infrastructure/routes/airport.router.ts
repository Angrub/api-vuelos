import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AirportService } from "../../services/airport.service";
import { HttpError } from "../httpError.module";
import { Authorization } from "../middlewares/jwt_auth";
import { 
    createAircraftValidator, 
    createAirportValidator, 
    deleteAircraftValidator, 
    listAircraftsValidator 
} from "../middlewares/validations/airport.validator";

function airportRouter(service: AirportService) {
    const router = Router();

    router.post('/',
        createAirportValidator,
        Authorization('admin'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }

                await service.create(req.body);
                res.status(201).json({message: 'created'});
            } catch(error) {
                next(error);
            }
    });

    router.get('/',
        Authorization('admin'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                
                const airports = await service.all();
                res.json({airports});
            } catch(error) {
                next(error);
            }
    });

    router.post('/aircraft',
        createAircraftValidator,
        Authorization('admin'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }

                await service.createAircraft(req.body);
                res.status(201).json({message: 'created'});
            } catch(error) {
                next(error);
            }
    });

    router.get('/aircraft/:airportId',
        listAircraftsValidator,
        Authorization('admin'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }

                const { airportId } = req.params;
                const aircrafts = await service.allAircrafts(airportId);
                res.json({aircrafts});
            } catch(error) {
                next(error);
            }
    });

    router.delete('/aircraft/:airportId/:id',
        deleteAircraftValidator,
        Authorization('admin'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }

                const { airportId, id } = req.params;
                const aircraft = await service.deleteAircraft({airportId, id});
                res.json({aircraft});
            } catch(error) {
                next(error);
            }
    });

    return router;
}

export { airportRouter }