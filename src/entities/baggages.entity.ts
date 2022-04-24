import { Types } from 'mongoose';
import { Baggage } from './sub_entities/baggage.entity';

interface Baggages {
    _flight_id: Types.ObjectId;
    baggages: Baggage[];
}

interface BaggagesObject extends Baggages {
    _id: Types.ObjectId;
}

export { Baggages, BaggagesObject }