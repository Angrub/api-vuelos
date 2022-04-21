import { Flight, FlightObject } from "../../entities/flight.entity";
import { Baggage } from "../../entities/sub_entities/baggage.entity";
import { Ticket } from "../../entities/sub_entities/ticket.entity";

interface FlightDBPort {
    createFlight: (flightData: Flight) => Promise<FlightObject | undefined>;
    findFlight: (id: string) => Promise<FlightObject | undefined>;
    findAll: (query: queryFindAll) => Promise<FlightObject[]>;
    updateFlightStatus: (id: string, status: boolean) => Promise<Flight | undefined>;
    createTicket: (flightId: string, userId: string) => Promise<Ticket>;
    deleteTicket: (flightId: string, findTicket: findTicketParam) => Promise<Ticket | undefined>;
    createBaggage: (weight?: number) => Promise<Baggage>;
    deleteBaggage: (id: string) => Promise<Baggage | undefined>
}

type queryFindAll = {
    offset: number;
    date: Date | undefined;
    name: string | undefined;
}
type findTicketParam = {userId: string} | {ticketId: string};

export { FlightDBPort }