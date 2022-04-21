import { Types } from 'mongoose';
import { Aircraft } from './sub_entities/aircraft.entity';

interface Airport {
    airlane: String;
    name: String;
    main: boolean
    latitude: number;
    longitude: number;
}

interface AirportObject extends Airport {
    _id: Types.ObjectId;
    aircrafts: Types.ArraySubdocument<Aircraft>;
}

export { Airport, AirportObject }