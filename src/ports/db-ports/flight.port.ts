import { FlightCreateParams, FlightObject } from "../../entities/flight.entity";
import { BaggageObject } from "../../entities/sub_entities/baggage.entity";
import { TicketObject } from "../../entities/sub_entities/ticket.entity";

interface FlightDBPort {
    createFlight: (flightData: FlightCreateParams) => Promise<FlightObject>;
    findFlight: (id: string) => Promise<FlightObject | undefined>;
    findAll: (query: queryFindAll) => Promise<FlightObject[]>;
    updateFlightStatus: (id: string, status: boolean) => Promise<FlightObject | undefined>;
    createTicket: (flightId: string, userId: string) => Promise<TicketObject | undefined | string>;
    findAllTickets: (flightId: string) => Promise<TicketObject[] | undefined>;
    deleteTicket: (flightId: string, id: string) => Promise<TicketObject | undefined>;
    createBaggage: (flightId: string, userId: string, weight?: number) => Promise<BaggageObject | undefined>;
    findAllBaggages: (flightId: string) => Promise<BaggageObject[] | undefined>;
    deleteBaggage: (flightId: string, id: string) => Promise<BaggageObject | undefined>
}

type queryFindAll = {
    offset?: number;
    date?: string;
    filterForDate?: filterWithDate;
    filterForCurrentDate?: filterWithCurrentDate;
    name?: string;
}

type filterWithDate = 'current' | 'after' | 'before';
type filterWithCurrentDate = 'last_day' | 'last_week' | 'last_month' | 'last_year';


export { 
    FlightDBPort, 
    queryFindAll,
    filterWithDate,
    filterWithCurrentDate
}