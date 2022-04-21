import { Aircraft, AircraftObject } from "../../entities/sub_entities/aircraft.entity";
import { Airport, AirportObject } from "../../entities/airport.entity";

interface AirportDBPort {
    createAirport: (airportData: Airport) => Promise<AirportObject>;
    findAirport: (name: string) => Promise<AirportObject | undefined>;
    findAll: () => Promise<AirportObject[]>;
    createAircraft: (airportId: string, data: Aircraft) => Promise<AircraftObject | undefined>;
    findAircraft: (id: string) => Promise<AircraftObject | undefined>; 
    findAllAircraft: () => Promise<AircraftObject[]>; 
    deleteAircraft: (id: string) => Promise<AircraftObject | undefined>;
}

export { AirportDBPort }