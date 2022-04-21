
interface Aircraft {
    model: string;
    base_cost_per_seat: number;
    seats: number;
}

interface AircraftObject extends Aircraft {
    _id: string;
}

export { Aircraft, AircraftObject }