import { Scope } from '../entities/user.entity'
import { Types } from 'mongoose';

interface AuthModulePort {
    createHashPassword: (password: string) => Promise<string>;
    verifyPassword: (hash: string, password: string) => Promise<boolean>;
    signToken: (payload: Payload, secret: string) => string;
}

type Payload = {
    sub: string;
    scope: Scope;
    id: Types.ObjectId;
}

export { AuthModulePort, Payload }