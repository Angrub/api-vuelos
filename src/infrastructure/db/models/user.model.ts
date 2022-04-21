import { findParams, UserDBPort } from "../../../ports/db-ports/user.port";
import { Schema, model, Model } from "mongoose";
import { User, UserObject } from "../../../entities/user.entity";

class UserModel implements UserDBPort {
    model: Model<User>

    constructor() {
        this.model = this.init();
    }

    init() {
        const userSchema = new Schema<User>({
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
        
        return model<User>('Users', userSchema);
    }

    async createUser(userData: User) {
        const newUser = new this.model(userData);
        await newUser.save();
    }

    async findUser(findId: findParams) {
        const key = Object.keys(findId)[0];
        const value = Object.values(findId)[0];
        const user = <UserObject | undefined> await this.model.findOne({[key]: value}).select({
            _id: 1, 
            username: 1, 
            email: 1, 
            password: 1, 
            scope: 1
        });

        return user;
    }

    async findAll() {
        const users = <UserObject[]> await this.model.find().select({
            _id: 1, 
            username: 1, 
            email: 1, 
            password: 1, 
            scope: 1
        });
        return users;
    }

    async deleteUser(email: string) {
        const userDeleted = <UserObject | undefined> await this.model.findOneAndDelete({email}).select({
            _id: 1, 
            username: 1, 
            email: 1, 
            password: 1, 
            scope: 1
        });

        return userDeleted
    }

    async updatePassword(email: string, password: string) {
        const userUpdated = <UserObject | undefined> await this.model.findOneAndUpdate(
                {email},
                {password}
            ).select({
            _id: 1, 
            username: 1, 
            email: 1, 
            password: 1, 
            scope: 1
        });

        return userUpdated;
    }

}

export { UserModel }