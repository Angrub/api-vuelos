import { Router } from "express";
import { AirportService } from "../../services/airport.service";
import { FlightService } from "../../services/flight.service";
import { UserService } from "../../services/user.service";
import { AirportModel } from "../db/models/airport.model";
import { FlightModel } from "../db/models/flight.model";
import { UserModel } from "../db/models/user.model";
import { AuthModule } from "../hash.module";
import { airportRouter } from "./airport.router";
import { flightRouter } from "./flight.router";
import { userRouter } from "./user.router";

// user service
const auth = new AuthModule();
const userModel = new UserModel();
const userService = new UserService(userModel, auth);

// flight service
const flightModel = new FlightModel();
const airportModel = new AirportModel()
const flightService = new FlightService(flightModel, airportModel, userModel);

// airport service
const airportService = new AirportService(airportModel);

const router = Router()

router.use('/v1/auth', userRouter(userService));
router.use('/v1/flights', flightRouter(flightService));
router.use('/v1/airports', airportRouter(airportService));

export { router as ApiRouter }