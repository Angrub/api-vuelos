import { Types } from 'mongoose';
import { Baggage } from './sub_entities/baggage.entity';

interface Baggages {
    _id: Types.ObjectId;
    flight_id: Types.ObjectId;
    baggages: Types.Subdocument<Baggage>;
}

export { Baggages }