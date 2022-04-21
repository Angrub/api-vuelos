import { DecodePayload } from "../src/infrastructure/middlewares/jwt_auth";

declare module 'express-serve-static-core' {
    export interface Request {
       decode: DecodePayload;
    }
 }