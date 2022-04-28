import { Router } from "express";
import { config } from "../../config";
import { AirportService } from "../../services/airport.service";
import { FlightService } from "../../services/flight.service";
import { UserService } from "../../services/user.service";
import { AirportModel } from "../db/storage/airport.storage";
import { FlightModel } from "../db/storage/flight.storage";
import { UserModel } from "../db/storage/user.storage";
import { AuthModule } from "../hash.module";
import { airportRouter } from "./airport.router";
import { flightRouter } from "./flight.router";
import { userRouter } from "./user.router";

async function getRouter() {
    const router = Router();
    
    // user service
    const auth = new AuthModule();
    const userModel = new UserModel();
    const userService = new UserService(userModel, auth);
    
    // flight service
    const airportModel = new AirportModel();
    const flightModel = new FlightModel();
    const flightService = new FlightService(flightModel, airportModel, userModel);
    
    // airport service
    const airportService = new AirportService(airportModel);
    
    // initialize services
    if(config.app.adminPassword && config.app.adminEmail) {
        await userService.init(config.app.adminEmail, config.app.adminPassword);
    } else {
        throw new Error('env variable ADMIN_PASSWORD or ADMIN_EMAIL is not defined');
    }
    await airportService.init();
    
    router.use('/v1/auth', userRouter(userService));
    router.use('/v1/flights', flightRouter(flightService));
    router.use('/v1/airports', airportRouter(airportService));
    
    return router;
}


export { getRouter }