import { Schema } from 'mongoose';
import { Subscriptions } from '../../../../entities/subscriptions.entity';
import { TicketSchema } from './ticket.schema';

const SubscriptionsSchema = new Schema<Subscriptions>({
    _flight_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    tickets: {
        type: [TicketSchema],
        required: true
    }
});

export { SubscriptionsSchema }