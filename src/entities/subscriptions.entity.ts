import { Types } from 'mongoose';
import { Ticket } from './sub_entities/ticket.entity';

interface Subscriptions {
    _flight_id: Types.ObjectId;
    tickets: Ticket[];
}

interface SubscriptionsObject extends Subscriptions {
    _id: Types.ObjectId;
}

export { Subscriptions, SubscriptionsObject };