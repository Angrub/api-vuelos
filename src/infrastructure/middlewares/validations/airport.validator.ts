import { body, query, param } from 'express-validator';

const createAirportValidator = [
    body('name').exists({checkFalsy: true}).isString(),
    body('airline').exists({checkFalsy: true}).isString(),
    body('latitude').isNumeric(),
    body('longitude').isNumeric()
];

const createAircraftValidator = [
    body('airportId').exists({checkFalsy: true}).isString().isLength({min: 24}),
    body('aircraftData.model').exists({checkFalsy: true}).isString(),
    body('aircraftData.base_cost_per_seat').isNumeric(),
    body('aircraftData.seats').isNumeric(),
];

const listAircraftsValidator = [
    param('airportId').exists({checkFalsy: true}).isString().isLength({min: 24})
];

const deleteAircraftValidator = [
    param('id').exists({checkFalsy: true}).isString().isLength({min: 24})
].concat(listAircraftsValidator);

export {
    createAirportValidator,
    createAircraftValidator,
    listAircraftsValidator,
    deleteAircraftValidator
}