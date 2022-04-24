import { Types } from 'mongoose';
import { Aircraft } from './sub_entities/aircraft.entity';

interface FlightCreateParams {
    name: string;
    aircraft: Aircraft;
    departing: Date;
    returning: Date;
    _from_id: Types.ObjectId;
    _to_id: Types.ObjectId;
}

interface Flight extends FlightCreateParams {
    active: boolean;
    _subscriptions_id: Types.ObjectId;
    _baggages_id: Types.ObjectId;
}

interface FlightObject extends Flight {
    _id: Types.ObjectId;
}

export { Flight, FlightObject, FlightCreateParams }