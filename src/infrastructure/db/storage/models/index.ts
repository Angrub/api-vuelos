import { model } from 'mongoose';
import { Airport } from '../../../../entities/airport.entity';
import { Baggages } from '../../../../entities/baggages.entity';
import { Flight } from '../../../../entities/flight.entity';
import { Subscriptions } from '../../../../entities/subscriptions.entity';
import { User } from '../../../../entities/user.entity';
import { AirportSchema } from '../schemas/airport.schema';
import { BaggagesSchema } from '../schemas/baggages.schema';
import { FlightSchema } from '../schemas/flight.schema';
import { SubscriptionsSchema } from '../schemas/subscriptions.schema';
import { UserSchema } from '../schemas/user.schema';

const airportModel = model<Airport>('Airports', AirportSchema);
const flightModel = model<Flight>('Flights', FlightSchema);
const subsModel = model<Subscriptions>('Subscriptions', SubscriptionsSchema);
const baggagesModel = model<Baggages>('Baggages', BaggagesSchema);
const userModel = model<User>('Users', UserSchema);

export {
    userModel,
    airportModel,
    flightModel,
    subsModel,
    baggagesModel
}