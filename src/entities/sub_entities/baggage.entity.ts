import { Types } from 'mongoose';

interface Baggage {
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    weight?: number;
}

export { Baggage }