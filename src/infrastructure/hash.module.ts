import { AuthModulePort, Payload } from "../ports/auth.port";
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

class AuthModule implements AuthModulePort{

    constructor(){}

    async createHashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
    
    async verifyPassword(hash: string, password: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }

    signToken(payload: Payload, secret: string) {
        return Jwt.sign(payload, secret);
    }
    
}

export { AuthModule }