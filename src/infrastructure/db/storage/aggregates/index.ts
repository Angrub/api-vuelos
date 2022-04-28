import { filterWithCurrentDate, filterWithDate } from "../../../../ports/db-ports/flight.port";

function aggregateForName(name: string) {
    const nameMatch = { $match: { name }};
    return nameMatch;
} 

function aggregateForDate(date: string, filter: filterWithDate) {
    switch(filter) {
        case 'current': 
            return {
                $match: {
                    $expr: { $eq: [{$dayOfMonth: '$departing'}, {$dayOfMonth: new Date(date)}] }
                }
            }

        case 'before':
            return {
                $match: {
                    departing: { $lte: new Date(date) }
                }
            }

        case 'after':
            return {
                $match: {
                    departing: { $gte: new Date(date) }
                }
            }
    } 
}

function aggregateForCurrentDate(filterData: filterWithCurrentDate) {
    switch(filterData) {
        case 'last_day':
            return {
                $match: {
                    $expr: { $eq: [{$dayOfMonth: '$departing'}, {$dayOfMonth: new Date()}] }
                }
            }

        case 'last_week':
            return {
                $match: {
                    $expr: { $eq: [{$week: '$departing'}, {$week: new Date()}] }
                }
            }

        case 'last_month':
            return {
                $match: {
                    $expr: { $eq: [{$month: '$departing'}, {$month: new Date()}] }
                }
            }

        case 'last_year':
            return {
                $match: {
                    $expr: { $eq: [{$year: '$departing'}, {$year: new Date()}] }
                }
            }
    }
}

export { aggregateForName, aggregateForDate, aggregateForCurrentDate }