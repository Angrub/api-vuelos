import { Schema } from 'mongoose';
import { Aircraft } from '../../../../entities/sub_entities/aircraft.entity';

const AircraftSchema = new Schema<Aircraft>({
    model: {
        type: String,
        required: true
    },
    base_cost_per_seat: {
        type: Number,
        required: true
    },
    seats: {
        type: Number,
        required: true
    }
});

export { AircraftSchema }