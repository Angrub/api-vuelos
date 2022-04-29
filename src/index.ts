import express from 'express'
import { config } from './config';
import { dbConnect, seederInit } from './infrastructure/db';
import { errorHandler } from './infrastructure/middlewares/error_handler';
import { logError } from './infrastructure/middlewares/log_error';
import { getRouter } from './infrastructure/routes';
import swaggerUi from 'swagger-ui-express';

async function init() {
    try {
        const server = express();
        const swaggerDocs = require('../swagger.json');
        server.use(express.json());
        
        // db
        await dbConnect();
        console.log('db connected :D');
        
        // routes
        const ApiRouter = await getRouter();
        server.use('/api', ApiRouter);
        server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        
        // seeders
        if(config.app.seeder > 0) {
            await seederInit({
                aircraftsNumber: 5,
                airportsNumber: 3,
                flightsNumber: 15
            })
        }
        
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