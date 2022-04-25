import { Aircraft } from "../entities/sub_entities/aircraft.entity";
import { HttpError } from "../infrastructure/httpError.module";
import { AirportDBPort } from "../ports/db-ports/airport.port";

class AirportService {
    private db: AirportDBPort;

    constructor(db: AirportDBPort) {
        this.db = db;

        this.init();
    }

    async init() {
        const main = await this.db.findAirport('default main');
        
        if(!main) {
            await this.db.createAirport({
                name: 'default main',
                main: true,
                airlane: 'default aeroline',
                aircrafts: [],
                latitude: 0,
                longitude: 0
            });
        }
    }

    async create(data: createAirportParams) {
        await this.db.createAirport({
            name: data.name,
            airlane: data.airline,
            latitude: data.latitude,
            longitude: data.longitude,
            aircrafts: [],
            main: false
        })
    }

    async all() {
        const airports = await this.db.findAll();
        return airports;
    }

    async createAircraft(data: createAircraftParams) {
        const newAircraft = await this.db.createAircraft(data.airportId, data.aircraftData);
        if(newAircraft) throw HttpError.BadRequest({message: 'nonexistent airport'});

        return newAircraft;
    }

    async allAircrafts(airportId: string) {
        const aircrafts = await this.db.findAllAircraft(airportId);
        if(!aircrafts) throw HttpError.BadRequest({message: 'nonexistent airport'});

        return aircrafts;
    }

    async deleteAircraft(data: deleteAircraftParams) {
        const { airportId, id } = data;
        const aircraftDeleted = await this.db.deleteAircraft(airportId, id);
        if(!aircraftDeleted) throw HttpError.BadRequest({message: 'nonexistent airport or aircraft'});

        return aircraftDeleted;
    }
}

type createAirportParams = {
    name: string;
    airline: string;
    latitude: number;
    longitude: number;
}

type createAircraftParams = {
    airportId: string;
    aircraftData: Aircraft;
}

type deleteAircraftParams = {
    airportId: string;
    id: string;
}

export { AirportService }