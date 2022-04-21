import { User, UserObject } from "../../entities/user.entity";

interface UserDBPort {
    createUser: (userData: User) => Promise<void>;
    findUser: (findId: findParams) => Promise<UserObject | undefined>;
    findAll: () => Promise<UserObject[]>;
    deleteUser: (id: string) => Promise<UserObject | undefined>; 
    updatePassword: (email: string, password: string) => Promise<UserObject | undefined>;
}

type findParams = {email: string} | {_id: string};

export { UserDBPort, findParams }