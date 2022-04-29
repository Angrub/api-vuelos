import { Schema } from 'mongoose';
import { Airport } from '../../../../entities/airport.entity';
import { AircraftSchema } from './aircraft.schema';

const AirportSchema = new Schema<Airport>({
    airline: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    main: {
        type: Schema.Types.Boolean,
        required: true
    },
    aircrafts: {
        type: [AircraftSchema],
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

export { AirportSchema }