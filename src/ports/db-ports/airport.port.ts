import { Aircraft, AircraftObject } from "../../entities/sub_entities/aircraft.entity";
import { Airport, AirportObject } from "../../entities/airport.entity";

interface AirportDBPort {
    createAirport: (airportData: Airport) => Promise<AirportObject>;
    findAirport: (name: string, main?: boolean) => Promise<AirportObject | undefined>;
    findAll: () => Promise<AirportObject[]>;
    createAircraft: (airportId: string, data: Aircraft) => Promise<AircraftObject | undefined>;
    findAircraft: (airportId: string, id: string) => Promise<AircraftObject | undefined>; 
    findAllAircraft: (airportId: string) => Promise<AircraftObject[] | undefined>; 
    deleteAircraft: (airportId: string, id: string) => Promise<AircraftObject | undefined>;
}

export { AirportDBPort }