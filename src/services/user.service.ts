import { UserDBPort } from "../ports/db-ports/user.port";
import { config } from '../config';
import { AuthModulePort } from "../ports/auth.port";
import { Scope } from "../entities/user.entity";
import { HttpError } from "../infrastructure/httpError.module";

class UserService {
    private db: UserDBPort;
    private authModule: AuthModulePort;

    constructor(db: UserDBPort, authModule: AuthModulePort) {
        this.db = db;
        this.authModule = authModule;
    }

    async init(adminEmail: string, adminPassword: string) {
        const admin = await this.db.findUser({email: adminEmail});
        if(!admin){
            await this.db.createUser({
                username: 'admin',
                email: adminEmail,
                password: await this.authModule.createHashPassword(adminPassword),
                scope: 'admin'
            });
        }
    }

    async create(data: createParams, scope: Scope) {
        const user = await this.db.findUser({email: data.email});

        if(user) throw HttpError.BadRequest({message: 'There is already a user with this email'}) 

        const hash = await this.authModule.createHashPassword(data.password);
        await this.db.createUser({
            username: data.username,
            email: data.email,
            password: hash,
            scope 
        });
    }

    async auth(email: string, password: string) {
        const user = await this.db.findUser({email});
        if(!user) throw HttpError.Unauthorized();
        
        const isMatch = await this.authModule.verifyPassword(user.password, password);
        if(!isMatch) throw HttpError.Unauthorized();
    
        const token = this.authModule.signToken({
            sub: user.email,
            scope: user.scope,
            id: user._id
        }, config.app.jwtSecret);

        return token;
    }

    async all() {
        const users = await this.db.findAll();
        return users;
    }

    async delete(sub: string, scope: Scope, id: string) {
        const user = await this.db.findUser({_id: id});

        if(!user) throw HttpError.BadRequest({message: 'Nonexistent user'});
        console.log(user, sub, scope, id)
        if(scope === 'admin') {
            if(sub === user.email) throw HttpError.Forbidden();
        } else {
            if(sub !== user.email) throw HttpError.Forbidden();
        }

        await this.db.deleteUser(user.email);
    }

    async updatePassword(sub: string, password: string, passwordConfirm: string) {
        if(password !== passwordConfirm) 
        throw HttpError.BadRequest({message: 'password and password confirm are not the same'});

        const hash = await this.authModule.createHashPassword(password);
        const userUpdated = await this.db.updatePassword(sub, hash);
        if(!userUpdated) throw HttpError.BadRequest({message: 'Nonexistent user'});
    }

}

type createParams = {
    username: string;
    email: string;
    password: string;
}

export { UserService }