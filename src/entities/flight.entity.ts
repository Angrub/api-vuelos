import { Types } from 'mongoose';

interface Flight {
    name: string;
    aircraft: Types.ObjectId;
    departing: Date;
    returning: Date;
    to: Types.ObjectId;
}

interface FlightObject extends Flight {
    _id: Types.ObjectId;
    active: boolean;
    subscriptions: Types.ObjectId;
    baggages: Types.ObjectId;
    from: Types.ObjectId;
}

export { Flight, FlightObject }