import { FlightCreateParams, FlightObject } from "../../entities/flight.entity";
import { BaggageObject } from "../../entities/sub_entities/baggage.entity";
import { TicketObject } from "../../entities/sub_entities/ticket.entity";

interface FlightDBPort {
    createFlight: (flightData: FlightCreateParams) => Promise<FlightObject>;
    findFlight: (id: string) => Promise<FlightObject | undefined>;
    findAll: (query: queryFindAll) => Promise<FlightObject[]>;
    updateFlightStatus: (id: string, status: boolean) => Promise<FlightObject | undefined>;
    createTicket: (flightId: string, userId: string) => Promise<TicketObject | undefined>;
    deleteTicket: (flightId: string, findTicket: findObjectParam) => Promise<TicketObject | undefined>;
    createBaggage: (flightId: string, userId: string, weight?: number) => Promise<BaggageObject | undefined>;
    deleteBaggage: (flightId: string, findBaggage: findObjectParam) => Promise<BaggageObject | undefined>
}

type queryFindAll = {
    offset: number;
    withDatetime?: filterWithDate;
    withoutDatetime?: filterWithCurrentDate;
    name?: string;
}

type filterWithDate = { date: string, filter: 'current' | 'after' | 'before'};
type filterWithCurrentDate = 'last_day' | 'last_week' | 'last_month' | 'last_year';

type findObjectParam = {
    userId?: string;
    objectId?: string;
};

export { 
    FlightDBPort, 
    queryFindAll, 
    findObjectParam ,
    filterWithDate,
    filterWithCurrentDate
}