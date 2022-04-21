import mongoose from 'mongoose';
import { config } from '../../config';

function dbConnect() {
    return mongoose.connect(config.db.uri);
}

export { dbConnect }