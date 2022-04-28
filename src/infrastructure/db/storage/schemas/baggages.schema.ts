import { Schema } from 'mongoose';
import { Baggages } from '../../../../entities/baggages.entity';
import { BaggageSchema } from './baggage.schema';

const BaggagesSchema = new Schema<Baggages>({
    _flight_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    baggages: {
        type: [BaggageSchema],
        required: true
    }
});

export { BaggagesSchema }