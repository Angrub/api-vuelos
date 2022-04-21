import { Types } from 'mongoose';

interface User {
    email: string;
    username: string;
    password: string;
    scope: Scope;
}

interface UserObject extends User {
    _id: Types.ObjectId;
}

type Scope = 'admin' | 'employee' | 'customer';

export { User, UserObject, Scope }