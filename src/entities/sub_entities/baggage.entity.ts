import { Types } from 'mongoose';

interface Baggage {
    _owner_id: Types.ObjectId;
    weight?: number;
}

interface BaggageObject extends Baggage {
    _id: Types.ObjectId;

}

export { Baggage, BaggageObject }