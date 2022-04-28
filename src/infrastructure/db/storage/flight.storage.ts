import { Flight, FlightCreateParams, FlightObject } from "../../../entities/flight.entity";
import { Model, Types } from 'mongoose';
import { FlightDBPort, queryFindAll } from "../../../ports/db-ports/flight.port";
import { Subscriptions } from "../../../entities/subscriptions.entity";
import { Baggages } from "../../../entities/baggages.entity";
import { aggregateForCurrentDate, aggregateForDate, aggregateForName, aggregateForOffset } from "./aggregates";
import { TicketObject } from "../../../entities/sub_entities/ticket.entity";
import { BaggageObject } from "../../../entities/sub_entities/baggage.entity";
import { baggagesModel, flightModel, subsModel } from "./models";

class FlightModel implements FlightDBPort {
    private model: Model<Flight>;
    private subsModel: Model<Subscriptions>;
    private baggagesModel: Model<Baggages>;

    constructor() {
        this.model = flightModel;
        this.subsModel = subsModel;
        this.baggagesModel = baggagesModel;
    }

    async createFlight(flightData: FlightCreateParams) {
        const newFlight = new this.model({
            ...flightData,
            active: false,
        });

        const newSubscriptions = new this.subsModel({
            _flight_id: newFlight._id,
            tickets: []
        });

        const newBaggages = new this.baggagesModel({
            _flight_id: newFlight._id,
            baggages: []
        });

        newFlight._subscriptions_id = newSubscriptions._id;
        newFlight._baggages_id = newBaggages._id;
        const flight = await newFlight.save();
        await newSubscriptions.save();
        await newBaggages.save(); 

        return flight;
    }

    async findFlight(id: string) {
        const flight = await this.model.findById(id);
        if(!flight) return undefined;

        return flight;
    }

    async findAll(query: queryFindAll) {
        const { 
            name,
            date,
            filterForDate,
            filterForCurrentDate,
            offset
         } = query;

        if(!name && !filterForCurrentDate && (!filterForDate || !date) && !offset) {
            return await this.model.find();

        } else {
            const aggregates = [];

            if(name) aggregates.push(aggregateForName(name));
            if(date && filterForDate) aggregates.push(aggregateForDate(date, filterForDate));
            if(filterForCurrentDate) aggregates.push(aggregateForCurrentDate(filterForCurrentDate));
            if(offset) aggregateForOffset(offset, aggregates);

            return await this.model.aggregate(aggregates);
        }
    }

    async updateFlightStatus(id: string, status: boolean) {
        const flightStatusUpdated = <FlightObject | undefined> await this.model.findOneAndUpdate({_id: id}, {active: status});
        return flightStatusUpdated;
    }

    async createTicket(flightId: string, userId: string) {
        const flight = await this.model.findById(flightId);
        const subscriptions = await this.subsModel.findOne({_flight_id: flightId});
        if(!subscriptions || !flight) return undefined;
        
        const { base_cost_per_seat } = flight.aircraft;
        if(base_cost_per_seat === subscriptions.tickets.length) return 'isFull';

        subscriptions.tickets.push({
            _owner_id: new Types.ObjectId(userId), 
            cost: base_cost_per_seat, 
            seat: subscriptions.tickets.length + 1
        });

        await subscriptions.save()
        
        const ticket = <TicketObject> subscriptions.tickets.pop();

        return ticket;
    }

    async findAllTickets(flightId: string) {
        const subscriptions = await this.subsModel.findOne({_flight_id: flightId});
        if(!subscriptions) return undefined;

        const tickets = <TicketObject[]> subscriptions.tickets;
        
        return tickets;
    }

    async deleteTicket(flightId: string, id: string) {
        const subscriptions = await this.subsModel.findOne({_flight_id: flightId});
        if(!subscriptions) return undefined;

        const tickets = <TicketObject[]> subscriptions.tickets;
        const ticketIndex = tickets.findIndex(ticket => {
            return ticket._id.toString() === id;
        }); 
        if(ticketIndex < 0) return undefined;

        const ticketDeleted = tickets[ticketIndex];
        subscriptions.tickets.splice(ticketIndex, 1);
        await subscriptions.save();

        return ticketDeleted;
    }    

    async createBaggage(flightId: string, userId: string, weight?: number) {
        const flight = await this.model.findById(flightId);
        const baggagesObject = await this.baggagesModel.findOne({_flight_id: flightId});
        if(!baggagesObject || !flight) return undefined;
        
        baggagesObject.baggages.push({
            _owner_id: new Types.ObjectId(userId),
            weight
        });

        await baggagesObject.save();
        const baggage = <BaggageObject> baggagesObject.baggages.pop();

        return baggage;
    }

    async findAllBaggages(flightId: string) {
        const baggagesObject = await this.baggagesModel.findOne({_flight_id: flightId});
        if(!baggagesObject) return undefined;

        const baggages =  <BaggageObject[]> baggagesObject.baggages;

        return baggages;
    }

    async deleteBaggage(flightId: string, id: string) {
        const baggagesObject = await this.baggagesModel.findOne({_flight_id: flightId});
        if(!baggagesObject) return undefined;

        const baggages = <BaggageObject[]> baggagesObject.baggages;
        const baggageIndex = baggages.findIndex(baggage => {
            return baggage._id.toString() === id;
        }); 
        if(baggageIndex < 0) return undefined;

        const baggageDeleted = baggages[baggageIndex];
        baggagesObject.baggages.splice(baggageIndex, 1);
        await baggagesObject.save();

        return baggageDeleted;
    }
}

export { FlightModel }