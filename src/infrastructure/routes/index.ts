import { Router } from "express";
import { UserRouter } from "./user.router";

const router = Router()

router.use('/v1/auth', UserRouter);

export { router as ApiRouter }