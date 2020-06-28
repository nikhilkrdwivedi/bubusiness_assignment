import { Schema, model } from 'mongoose';
import { date } from '@hapi/joi';
const rentalSchema = new Schema({
    isbn: {
        type: String,
        required: true,
    },
    cardHolder: {
        type: String,
        required: true,
    },
    isIssued: {
        type: Boolean
    },
    issuedDate: {
        type: Date
    },
    returnDate: {
        type: Date
    },
    issuedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
export default model('rental', rentalSchema);