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
    const today = new Date();
    switch(filterData) {
        case 'last_day':
            return {
                $match: {
                    $expr: { 
                        $and: [
                            { $eq: [{$dayOfYear: '$departing'}, {$dayOfYear: today}] },
                            { $eq: [{$year: '$departing'}, {$year: today}] }
                        ] 
                    }
                }
            }

        case 'last_week':
            return {
                $match: {
                    $expr: { $eq: [{$week: '$departing'}, {$week: today}] }
                }
            }

        case 'last_month':
            return {
                $match: {
                    $expr: { $eq: [{$month: '$departing'}, {$month: today}] }
                }
            }

        case 'last_year':
            return {
                $match: {
                    $expr: { $eq: [{$year: '$departing'}, {$year: today}] }
                }
            }
    }
}

function aggregateForOffset(offset: number, aggr: any[]) {
    console.log(offset, aggr)
    aggr.push({ $skip: offset })
    aggr.push({ $limit: 10 })
}

export { 
    aggregateForName, 
    aggregateForDate, 
    aggregateForCurrentDate,
    aggregateForOffset
}