import { Schema } from 'mongoose';
import { Flight } from '../../../../entities/flight.entity';
import { AircraftSchema } from './aircraft.schema';

const FlightSchema = new Schema<Flight>({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Schema.Types.Boolean,
        required: true
    },
    aircraft: {
        type: AircraftSchema,
        required: true
    },
    departing: {
        type: Date,
        required: true
    },
    returning: {
        type: Date,
        required: true
    },
    _subscriptions_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    _baggages_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    _from_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    _to_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

export { FlightSchema }