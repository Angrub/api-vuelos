import { Flight, FlightCreateParams, FlightObject } from "../../../entities/flight.entity";
import { Model, model } from 'mongoose';
import { FlightDBPort, queryFindAll } from "../../../ports/db-ports/flight.port";
import { FlightSchema } from "./schemas/flight.schema";
import { Subscriptions } from "../../../entities/subscriptions.entity";
import { Baggages } from "../../../entities/baggages.entity";
import { SubscriptionsSchema } from "./schemas/subscriptions.schema";
import { BaggagesSchema } from "./schemas/baggages.schema";
import { aggregateForCurrentDate, aggregateForDate, aggregateForName } from "./aggregates";
import { TicketObject } from "../../../entities/sub_entities/ticket.entity";

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
        const subscription = await this.subsModel.findOne({_flight_id: flightId});
        if(!subscription || !flight) return undefined;
        
        subscription.tickets.push({
            _owner_id: userId, 
            cost: flight.aircraft.base_cost_per_seat, 
            seat: subscription.tickets.length + 2
        })

        const subscriptionUpdated = await this.subsModel.findOneAndUpdate(
            {_flight_id: flightId},
            {tickets: subscription.tickets}
        )

        const ticket = <TicketObject> subscriptionUpdated?.tickets.pop();

        return ticket;
    }

    async deleteTicket(){}    
    async createBaggage(){}
    async deleteBaggage(){}
}