import { HttpError } from "../infrastructure/httpError.module";
import { AirportDBPort } from "../ports/db-ports/airport.port";
import { findObjectParam, FlightDBPort, queryFindAll } from "../ports/db-ports/flight.port";
import { UserDBPort } from "../ports/db-ports/user.port";

class FlightService {
    private flightsDB: FlightDBPort;
    private airportDB: AirportDBPort;
    private userDB: UserDBPort;

    constructor(flightsDB: FlightDBPort, airportDB: AirportDBPort, userDB: UserDBPort) {
        this.flightsDB = flightsDB;
        this.airportDB = airportDB;
        this.userDB = userDB;
    }

    async create(data: createFlightParams) {
        const mainAirport = await this.airportDB.findAirport('', true);
        if(!mainAirport) throw HttpError.InternalServerError('Main airport is not defined');

        const aircraft = await this.airportDB.findAircraft(mainAirport._id.toString(), data.aircraftId);
        if(!aircraft) throw HttpError.BadRequest({message: 'nonexistent aircraft'});

        const destinationAirport = await this.airportDB.findAirport(data._to_name);
        if(!destinationAirport) throw HttpError.BadRequest({message: 'nonexistent airport'});

        await this.flightsDB.createFlight({
            name: data.name,
            departing: new Date(data.departing),
            returning: new Date(data.returning),
            _from_id: mainAirport._id,
            _to_id: destinationAirport._id,
            aircraft: aircraft
        });
    }

    async all(query: queryFindAll) {
        const flights = await this.flightsDB.findAll(query);
        return flights;
    }

    async updateStatus(data: updateFlightStatusParams) {
        const { id, status } = data;
        await this.flightsDB.updateFlightStatus(id, status);
    }

    async subscribe(data: subscribeParams) {
        const { flightId, userId } = data;
        const user = await this.userDB.findUser({_id: userId});
        if(!user) throw HttpError.BadRequest({message: 'nonexistent user'});

        const ticket = await this.flightsDB.createTicket(flightId, userId);
        if(!ticket) throw HttpError.BadRequest({message: 'nonexistent flight'});

        return ticket;
    }

    async unsubscribe(data: removeObjectParams) {
        const { flightId, findObject } = data;
        const ticketDeleted = await this.flightsDB.deleteTicket(flightId, findObject);
        if(!ticketDeleted) throw HttpError.BadRequest({message: 'nonexistent flight or ticket'});

        return ticketDeleted;
    }

    async addBaggage(data: toRegisterBaggageParams) {
        const { flightId, userId, weight } = data;
        const user = await this.userDB.findUser({_id: userId});
        if(!user) throw HttpError.BadRequest({message: 'nonexistent user'});

        const baggage = await this.flightsDB.createBaggage(flightId, userId, weight);
        if(!baggage) throw HttpError.BadRequest({message: 'nonexistent flight'});

        return baggage;
    }

    async removeBaggage(data: removeObjectParams) {
        const { flightId, findObject } = data;
        const baggageDeleted = await this.flightsDB.deleteBaggage(flightId, findObject);
        if(!baggageDeleted) throw HttpError.BadRequest({message: 'nonexistent flight or baggage'});

        return baggageDeleted;
    }    
}

type createFlightParams = {
    name: string;
    departing: string;
    returning: string;
    aircraftId: string;
    _to_name: string;
}

type updateFlightStatusParams = {
    id: string;
    status: boolean;
}

type subscribeParams = {
    flightId: string; 
    userId: string;
}

type removeObjectParams = {
    flightId: string;
    findObject: findObjectParam
}

type toRegisterBaggageParams = {
    weight?: number;
} & subscribeParams

export { FlightService }