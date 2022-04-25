import { Flight, FlightCreateParams, FlightObject } from "../../../entities/flight.entity";
import { Model, model } from 'mongoose';
import { findObjectParam, FlightDBPort, queryFindAll } from "../../../ports/db-ports/flight.port";
import { FlightSchema } from "./schemas/flight.schema";
import { Subscriptions } from "../../../entities/subscriptions.entity";
import { Baggages } from "../../../entities/baggages.entity";
import { SubscriptionsSchema } from "./schemas/subscriptions.schema";
import { BaggagesSchema } from "./schemas/baggages.schema";
import { aggregateForCurrentDate, aggregateForDate, aggregateForName } from "./aggregates";
import { TicketObject } from "../../../entities/sub_entities/ticket.entity";
import { BaggageObject } from "../../../entities/sub_entities/baggage.entity";

class FlightModel implements FlightDBPort {
    model: Model<Flight>;
    subsModel: Model<Subscriptions>;
    baggagesModel: Model<Baggages>;

    constructor() {
        this.model = model<Flight>('Flights', FlightSchema);
        this.subsModel = model<Subscriptions>('Subscriptions', SubscriptionsSchema);
        this.baggagesModel = model<Baggages>('Baggages', BaggagesSchema);
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
        const aggregates = [];

        if(query.name) aggregates.push(aggregateForName(query.name));
        if(query.withDatetime) aggregates.push(aggregateForDate(query.withDatetime));
        if(query.withoutDatetime) aggregates.push(aggregateForCurrentDate(query.withoutDatetime));

        const flights = await this.model.aggregate(aggregates);

        return flights
    }

    async updateFlightStatus(id: string, status: boolean) {
        const flightStatusUpdated = <FlightObject | undefined> await this.model.findOneAndUpdate({_id: id}, {status});
        return flightStatusUpdated;
    }

    async createTicket(flightId: string, userId: string) {
        const flight = await this.model.findById(flightId);
        const subscriptions = await this.subsModel.findOne({_flight_id: flightId});
        if(!subscriptions || !flight) return undefined;
        
        subscriptions.tickets.push({
            _owner_id: userId, 
            cost: flight.aircraft.base_cost_per_seat, 
            seat: subscriptions.tickets.length + 2
        })

        const subscriptionUpdated = await this.subsModel.findOneAndUpdate(
            {_flight_id: flightId},
            {tickets: subscriptions.tickets}
        )

        const ticket = <TicketObject> subscriptionUpdated?.tickets.pop();

        return ticket;
    }

    async deleteTicket(flightId: string, findTicket: findObjectParam){
        const subscriptions = await this.subsModel.findOne({_flight_id: flightId});
        if(!subscriptions) return undefined;

        const ticketIndex = subscriptions.tickets.findIndex((ticket: any) => {
            if(findTicket.userId) return ticket._owner_id === findTicket.userId;
            else if(findTicket.objectId) return ticket._id === findTicket.objectId;
        }); 
        if(ticketIndex < 0) return undefined;

        const ticketDeleted = subscriptions.tickets[ticketIndex];
        subscriptions.tickets = subscriptions.tickets.splice(ticketIndex, 1);
        await this.subsModel.findOneAndUpdate(
            { _id: subscriptions._id },
            {tickets: subscriptions.tickets}
        );

        return <TicketObject> ticketDeleted;
    }    

    async createBaggage(flightId: string, userId: string, weight?: number) {
        const flight = await this.model.findById(flightId);
        const baggages = await this.baggagesModel.findOne({_flight_id: flightId});
        if(!baggages || !flight) return undefined;
        
        baggages.baggages.push({
            _owner_id: userId,
            weight
        })

        const baggagesUpdated = await this.baggagesModel.findOneAndUpdate(
            {_flight_id: flightId},
            {baggages: baggages.baggages}
        )

        const baggage = <BaggageObject> baggagesUpdated?.baggages.pop();

        return baggage;
    }

    async deleteBaggage(flightId: string, findBaggage: findObjectParam) {
        const baggages = await this.baggagesModel.findOne({_flight_id: flightId});
        if(!baggages) return undefined;

        const baggageIndex = baggages.baggages.findIndex((baggage: any) => {
            if(findBaggage.userId) return baggage._owner_id === findBaggage.userId;
            else if(findBaggage.objectId) return baggage._id === findBaggage.objectId;
        }); 
        if(baggageIndex < 0) return undefined;

        const baggageDeleted = baggages.baggages[baggageIndex];
        baggages.baggages = baggages.baggages.splice(baggageIndex, 1);
        await this.baggagesModel.findOneAndUpdate(
            { _id: baggages._id },
            {baggages: baggages.baggages}
        );

        return <BaggageObject> baggageDeleted;
    }
}

export { FlightModel }