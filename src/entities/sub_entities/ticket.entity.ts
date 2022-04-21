import { Types } from 'mongoose';

interface Ticket {
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    cost: number;
    seat: number;
}

export { Ticket }