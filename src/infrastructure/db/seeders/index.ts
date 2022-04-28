import { Model, Types } from 'mongoose';
import { Airport, AirportObject } from '../../../entities/airport.entity';
import { AircraftObject } from '../../../entities/sub_entities/aircraft.entity';
import { Flight } from '../../../entities/flight.entity';
import { Subscriptions } from '../../../entities/subscriptions.entity';
import { Baggages } from '../../../entities/baggages.entity';
import {
    word,
    cityName,
    latitude,
    longitude,
    hex,
    number,
    date,
    
} from 'minifaker';
import 'minifaker/locales/en' 


async function airportsSeeder(itemsNumber: number, model: Model<Airport>) {
    const airports = [];

    for(let i = 0; i < itemsNumber; i++) {
        airports.push(new model({
            airlane: word().toUpperCase(),
            name: cityName(),
            main: false,
            aircrafts: [],
            latitude: Number(latitude()),
            longitude: Number(longitude())
        }))
    }

    await model.insertMany(airports);
}

async function aircraftsSeeder(itemsNumber: number, airport: any) {

    for(let i = 0; i < itemsNumber; i++) {
        airport.aircrafts.push({
            model: hex(),
            base_cost_per_seat: number({min: 300, max: 4500}),
            seats: number({min: 100, max: 400})
        });
    }

    await airport.save();
    return <AircraftObject[]> airport.aircrafts;
}

async function flightsSeeder(itemsNumber: number, models: modelsParams, data: dataParams) {
    const flights = [];
    const subscriptions = [];
    const baggages = [];

    for(let i = 0; i < itemsNumber; i++) {
        const today = new Date();
        const from = new Date(today.getTime() - 31536000000);
        const to = new Date(today.getTime() + 31536000000);
        const departing = date({from, to});
        const returning = new Date(departing.getTime() + 604800000);
        
        const newFlight = new models.flightModel({
            name: hex(),
            aircraft: randomItem(data.aircrafts),
            active: false,
            _from_id: data.from,
            _to_id: randomItem(data.airports)._id,
            departing,
            returning, 
        });
    
        const newSubscriptions = new models.subsModel({
            _flight_id: newFlight._id,
            tickets: []
        });
    
        const newBaggages = new models.baggagesModel({
            _flight_id: newFlight._id,
            baggages: []
        });
    
        newFlight._subscriptions_id = newSubscriptions._id;
        newFlight._baggages_id = newBaggages._id;
        flights.push(newFlight);
        subscriptions.push(newSubscriptions);
        baggages.push(newBaggages);
    }

    await models.flightModel.insertMany(flights);
    await models.subsModel.insertMany(subscriptions);
    await models.baggagesModel.insertMany(baggages);
}


function randomItem(array: any[]) {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
} 

type modelsParams = {
    flightModel: Model<Flight>;
    subsModel: Model<Subscriptions>;
    baggagesModel: Model<Baggages>;
}

type dataParams = {
    aircrafts: AircraftObject[]; 
    airports: AirportObject[];
    from: Types.ObjectId;
}

export { 
    airportsSeeder,
    aircraftsSeeder,
    flightsSeeder
}