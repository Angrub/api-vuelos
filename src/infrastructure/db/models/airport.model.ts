import { AirportDBPort } from "../../../ports/db-ports/airport.port";
import { Model, model, Types } from 'mongoose';
import { Airport } from "../../../entities/airport.entity";
import { AirportSchema } from "./schemas/airport.schema";
import { Aircraft, AircraftObject } from "../../../entities/sub_entities/aircraft.entity";

class AirportModel implements AirportDBPort {
    private model: Model<Airport>;
    
    constructor() {
        this.model = this.init();
    }

    init() {
        return model<Airport>('Airports', AirportSchema);
    }

    async createAirport(airportData: Airport) {
        const newAirport = new this.model(airportData);
        const airportSaved = await newAirport.save();
        return airportSaved;
    }

    async findAirport(_id: string, main?: boolean) {
        const key = main ? 'main' : '_id';
        const value = main ? main : _id;
        const airport = await this.model.findOne({[key]: value});
        if(!airport) return undefined;
        return airport;
    }

    async findAll() {
        const airports = await this.model.find();
        return airports;
    }

    async createAircraft(airportId: string, data: Aircraft) {
        const airport = await this.model.findOne();
        if(!airport) return undefined;
        airport.aircrafts.push(data);
        const airportUpdated = await this.model.findOneAndUpdate(
            {_id: airportId}, 
            {aircrafts: airport.aircrafts});
        const aircraftCreated = <AircraftObject> airportUpdated?.aircrafts.pop();

        return aircraftCreated;
    }

    async findAircraft(airportId: string, id: string) {
        const airport = await this.model.findById(airportId);
        if(!airport) return undefined;

        const aircrafts = <AircraftObject[]> airport.aircrafts;
        const aircraft = aircrafts.find(_aircraft => {
            return _aircraft._id.toString() === id;
        });

        return aircraft;
    }

    async findAllAircraft(airportId: string) {
        const airport = await this.model.findById(airportId);
        if(!airport) return undefined;

        return <AircraftObject[]> airport.aircrafts;
    }   

    async deleteAircraft(airportId: string, id: string) {
        const airport = await this.model.findById(airportId);
        if(!airport) return undefined;

        const aircrafts = <AircraftObject[]> airport.aircrafts;
        const index = aircrafts.findIndex(_aircraft => {
            return _aircraft._id.toString() === id;
        });
        console.log(index)
        if(index < 0) return undefined;

        const aircraftDeleted = aircrafts[index];
        aircrafts.splice(index, 1);
        await this.model.findOneAndUpdate(
            {_id: airportId}, 
            {aircrafts});

        return <AircraftObject> aircraftDeleted;
    }
}

export { AirportModel }