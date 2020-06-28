import { Schema, model } from 'mongoose';
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean
    },
    addedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
export default model('book', bookSchema);