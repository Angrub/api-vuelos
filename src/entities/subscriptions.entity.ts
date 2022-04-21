import { Types } from 'mongoose';
import { Ticket } from './sub_entities/ticket.entity';

interface Subscriptions {
    _id: Types.ObjectId;
    flight_id: Types.ObjectId;
    tickets: Types.ArraySubdocument<Ticket>;
}

export { Subscriptions };