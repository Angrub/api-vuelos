import { AirportDBPort } from "../../../ports/db-ports/airport.port";
import { Model, model } from 'mongoose';
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

    async findAirport(name: string, main?: boolean) {
        const key = main ? 'main' : 'name';
        const value = main ? main : name;
        const airport = await this.model.findOne({[key]: value});
        if(!airport) return undefined;
        return airport;
    }

    async findAll() {
        const airports = await this.model.find();
        return airports;
    }

    async createAircraft(airportId: string, data: Aircraft) {
        const airport = await this.model.findById(airportId);
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
        const aircraft = <AircraftObject | undefined> airport.aircrafts.find((_aircraft: any) => {
            return _aircraft._id === id;
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

        const index = airport.aircrafts.findIndex((_aircraft: any) => {
            return _aircraft._id === id;
        });
        if(index < 0) return undefined;

        const aircraftDeleted = airport.aircrafts[index];
        airport.aircrafts = airport.aircrafts.splice(index, 1);

        await this.model.findOneAndUpdate(
            {_id: airportId}, 
            {aircrafts: airport.aircrafts});

        return <AircraftObject> aircraftDeleted;
    }
}

export { AirportModel }