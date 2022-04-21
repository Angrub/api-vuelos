import express from 'express'
import { config } from './config';
import { dbConnect } from './infrastructure/db';
import { errorHandler } from './infrastructure/middlewares/error_handler';
import { logError } from './infrastructure/middlewares/log_error';
import { ApiRouter } from './infrastructure/routes';

async function init() {
    try {
        const server = express();
        server.use(express.json());
        
        // db
        await dbConnect();
        console.log('db connected :D');
        
        // routes
        server.use('/api', ApiRouter);
        
        // middlewares
        server.use(logError);
        server.use(errorHandler);
        
        // server init
        server.listen(config.app.port, () => {
            console.log(`server on port ${config.app.port} :D`);
        });
    } catch(error) {
        console.error(error);
    }
}

init();