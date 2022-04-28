import { Schema } from 'mongoose';
import { User } from '../../../../entities/user.entity';

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        required: true
    },
});

export { UserSchema }