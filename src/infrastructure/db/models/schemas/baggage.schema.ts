import { Schema } from 'mongoose';
import { Baggage } from '../../../../entities/sub_entities/baggage.entity';

const BaggageSchema = new Schema<Baggage>({
    _owner_id: { 
        type: Schema.Types.ObjectId,
        require: true,
    },
    weight: {
        type: Number,
        required: true
    }
});

export { BaggageSchema }