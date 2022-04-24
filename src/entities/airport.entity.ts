import { Types } from 'mongoose';
import { Aircraft } from './sub_entities/aircraft.entity';

interface Airport {
    airlane: string;
    name: string;
    main: boolean
    aircrafts: Aircraft[];
    latitude: number;
    longitude: number;
}

interface AirportObject extends Airport {
    _id: Types.ObjectId;
}

export { Airport, AirportObject }