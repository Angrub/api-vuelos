import { Types } from 'mongoose';

interface Ticket {
    _owner_id: Types.ObjectId;
    cost: number;
    seat: number;
}

interface TicketObject extends Ticket {
    _id: Types.ObjectId;
}

export { Ticket, TicketObject }