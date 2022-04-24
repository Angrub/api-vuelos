import { FlightCreateParams, FlightObject } from "../../entities/flight.entity";
import { BaggageObject } from "../../entities/sub_entities/baggage.entity";
import { TicketObject } from "../../entities/sub_entities/ticket.entity";

interface FlightDBPort {
    createFlight: (flightData: FlightCreateParams) => Promise<FlightObject>;
    findFlight: (id: string) => Promise<FlightObject | undefined>;
    findAll: (query: queryFindAll) => Promise<FlightObject[]>;
    updateFlightStatus: (id: string, status: boolean) => Promise<FlightObject | undefined>;
    createTicket: (flightId: string, userId: string) => Promise<TicketObject | undefined>;
    deleteTicket: (flightId: string, findTicket: findTicketParam) => Promise<TicketObject | undefined>;
    createBaggage: (weight?: number) => Promise<BaggageObject | undefined>;
    deleteBaggage: (id: string) => Promise<BaggageObject | undefined>
}

type queryFindAll = {
    offset: number;
    withDatetime?: filterWithDate;
    withoutDatetime?: filterWithCurrentDate;
    name?: string;
}

type filterWithDate = { date: string, filter: 'current' | 'after' | 'before'};
type filterWithCurrentDate = 'last_day' | 'last_week' | 'last_month' | 'last_year';

type findTicketParam = {userId: string} | {ticketId: string};

export { 
    FlightDBPort, 
    queryFindAll, 
    findTicketParam ,
    filterWithDate,
    filterWithCurrentDate
}