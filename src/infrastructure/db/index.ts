import mongoose from 'mongoose';
import { config } from '../../config';
import { AirportObject } from '../../entities/airport.entity';
import { aircraftsSeeder, airportsSeeder, flightsSeeder } from './seeders';
import { airportModel, baggagesModel, flightModel, subsModel } from './storage/models';

async function dbConnect() {
    await mongoose.connect(config.db.uri);
}

async function seederInit(params: seederParams) {
    const {
        airportsNumber,
        aircraftsNumber,
        flightsNumber
    } = params;

    // airports
    console.log('generating airports...');
    await airportsSeeder(airportsNumber, airportModel);

    // aircrafts of the airport main
    console.log('generating aircrafts...');
    const mainAirport = await airportModel.findOne({main: true});
    if(!mainAirport) throw new Error('nonexistent main airport')
    const aircrafts = await aircraftsSeeder(aircraftsNumber, mainAirport);

    // flights
    console.log('generating flights...');
    const airports = <AirportObject[]> await airportModel.find();
    await flightsSeeder(flightsNumber, 
        {
            flightModel,
            baggagesModel,
            subsModel
        }, 
        {
            from: mainAirport._id,
            aircrafts,
            airports,
        }
    )
}

type seederParams = {
    airportsNumber: number;
    aircraftsNumber: number;
    flightsNumber: number
}

export { dbConnect, seederInit }