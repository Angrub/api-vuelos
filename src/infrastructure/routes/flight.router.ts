import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FlightService } from "../../services/flight.service";
import { HttpError } from "../httpError.module";
import { Authorization } from "../middlewares/jwt_auth";
import { 
    createFlightValidator, 
    listFlightsValidator, 
    listObjects, 
    registerBaggageValidator, 
    removeObjectValidator, 
    subscribeValidator, 
    updateStatusValidator 
} from "../middlewares/validations/flight.validator";

function flightRouter(service: FlightService) {
    const router = Router();

    router.post('/', 
        createFlightValidator,
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
        listFlightsValidator, 
        Authorization('employee'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                const flights = await service.all(req.query);
                res.json({flights}); 
            } catch(error) {
                next(error);
            }
    });

    router.patch('/',
        updateStatusValidator,
        Authorization('admin'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                await service.updateStatus(req.body);
                res.json({message: 'updated'});
            } catch(error) {
                next(error);
            }
    });

    router.post('/subscription', 
        subscribeValidator,
        Authorization('customer'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                const { flightId } = req.body;
                const ticket = await service.subscribe({flightId, userId: req.decode.id.toString()});
                res.status(201).json({ticket}); 
            } catch(error) {
                next(error);
            }
    });

    router.get('/subscription/:flightId',
        listObjects, 
        Authorization('employee'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                const subscriptions = await service.listSubscriptions(req.params.flightId);
                res.json({subscriptions}); 
            } catch(error) {
                next(error);
            }
    });

    router.delete('/subscription/:flightId/:id',
        removeObjectValidator,
        Authorization('employee'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                const { flightId, id } = req.params;
                const ticket = await service.unsubscribe({flightId, id});
                res.json({ticket}); 
            } catch(error) {
                next(error);
            }
    });

    router.post('/baggage', 
        registerBaggageValidator,
        Authorization('customer'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
                
                const { flightId, weight } = req.body;
                const baggage = await service.addBaggage({
                    flightId, 
                    weight, 
                    userId: req.decode.id.toString()
                });
                res.status(201).json({baggage}); 
            } catch(error) {
                next(error);
            }
    });

    router.get('/baggage/:flightId',
        listObjects, 
        Authorization('employee'), 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                const baggages = await service.listBaggages(req.params.flightId);
                res.json({baggages}); 
            } catch(error) {
                next(error);
            }
    });

    router.delete('/baggage/:flightId/:id',
        removeObjectValidator,
        Authorization('employee'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // data validation
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    throw HttpError.BadRequest(errors.array());
                }
            
                const { flightId, id } = req.params;
                const baggage = await service.removeBaggage({flightId, id});
                res.json({baggage}); 
            } catch(error) {
                next(error);
            }
    });

    return router;
}

export { flightRouter }