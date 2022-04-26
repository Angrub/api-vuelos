import { body, query, param } from 'express-validator';

const createFlightValidator = [
    body('name').exists({checkFalsy: true}).isString(),
    body('departing').isISO8601(),
    body('returning').isISO8601(),
    body('aircraft_id').exists({checkFalsy: true}).isString().isLength({min: 24}),
    body('_to_id').exists({checkFalsy: true}).isString().isLength({min: 24})
];

const listFlightsValidator = [
    query('offset').optional().isNumeric(),
    query('date').optional().isISO8601(),
    query('filterForDate').optional().custom(value => {
        const possibleValues = ['current', 'after', 'before'];
        if(!possibleValues.includes(value)) throw new Error('withDatetime.filter query is not valid');
        return true;
    }),
    query('filterForCurrentDate').optional().custom(value => {
        const possibleValues = ['last_day', 'last_week', 'last_month', 'last_year'];
        if(!possibleValues.includes(value)) throw new Error('filterForCurrentDate query is not valid');
        return true;
    }),
    query('name').optional().exists({checkFalsy: true}).isString()
];

const updateStatusValidator = [
    body('id').exists({checkFalsy: true}).isString().isLength({min: 24}),
    body('status').isBoolean()
];

const subscribeValidator = [
    body('flightId').exists({checkFalsy: true}).isString().isLength({min: 24}),
];


const registerBaggageValidator = [
    body('weight').optional().isNumeric({no_symbols: true})
].concat(subscribeValidator);

const removeObjectValidator = [
    param('flightId').exists({checkFalsy: true}).isString().isLength({min: 24}),
    query('userId').optional().exists({checkFalsy: true}).isString().isLength({min: 24}),
    query('objectId').optional().exists({checkFalsy: true}).isString().isLength({min: 24})
];

export {
    createFlightValidator,
    listFlightsValidator,
    updateStatusValidator,
    subscribeValidator,
    registerBaggageValidator,
    removeObjectValidator
}