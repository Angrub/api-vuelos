import { HttpError } from "../infrastructure/httpError.module";
import { AirportDBPort } from "../ports/db-ports/airport.port";
import { FlightDBPort, queryFindAll } from "../ports/db-ports/flight.port";
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
        if(!mainAirport) throw HttpError.InternalServerError('The main airport is not defined');

        const aircraft = await this.airportDB.findAircraft(mainAirport._id.toString(), data.aircraft_id);
        if(!aircraft) throw HttpError.BadRequest({message: 'nonexistent aircraft'});

        const destinationAirport = await this.airportDB.findAirport(data._to_id);
        if(!destinationAirport) throw HttpError.BadRequest({message: 'nonexistent airport'});
        if(destinationAirport.main) throw HttpError.BadRequest({message: 'The main airport cannot be a destination'})

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
        if(!flights) throw HttpError.BadRequest({message: 'There is not filter'})
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
        else if(ticket === 'isFull') HttpError.BadRequest({message: 'no seats available'});

        return ticket;
    }

    async listSubscriptions(flightId: string) {
        const subscriptions = await this.flightsDB.findAllTickets(flightId);
        if(!subscriptions) throw HttpError.BadRequest({message: 'nonexistent flight'});
        
        return subscriptions;
    }

    async unsubscribe(data: removeObjectParams) {
        const { flightId, id } = data;
        const ticketDeleted = await this.flightsDB.deleteTicket(flightId, id);
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

    async listBaggages(flightId: string) {
        const baggages = await this.flightsDB.findAllBaggages(flightId);
        if(!baggages) throw HttpError.BadRequest({message: 'nonexistent flight'});
        
        return baggages;
    }

    async removeBaggage(data: removeObjectParams) {
        const { flightId, id } = data;
        const baggageDeleted = await this.flightsDB.deleteBaggage(flightId, id);
        if(!baggageDeleted) throw HttpError.BadRequest({message: 'nonexistent flight or baggage'});

        return baggageDeleted;
    }    
}

type createFlightParams = {
    name: string;
    departing: string;
    returning: string;
    aircraft_id: string;
    _to_id: string;
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
    id: string;
}

type toRegisterBaggageParams = {
    weight?: number;
} & subscribeParams

export { FlightService }