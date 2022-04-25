import { Router } from "express";
import { UserService } from "../../services/user.service";
import { UserModel } from "../db/models/user.model";
import { AuthModule } from "../hash.module";
import { userRouter } from "./user.router";

const auth = new AuthModule();
const userModel = new UserModel();
const userService = new UserService(userModel, auth);
const router = Router()

router.use('/v1/auth', userRouter(userService));

export { router as ApiRouter }