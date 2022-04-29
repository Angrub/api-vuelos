import { Schema } from 'mongoose';
import { Ticket } from '../../../../entities/sub_entities/ticket.entity';

const TicketSchema = new Schema<Ticket>({
    _owner_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    seat: {
        type: Number,
        required: true
    }
});

export { TicketSchema }