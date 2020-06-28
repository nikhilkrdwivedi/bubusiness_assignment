import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 100,
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        index: { unique: true }
    },
    contact: {
        type: String,
        required: true,
        max: 10,
        min: 10,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    cardNumber: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
});
export default model('User', userSchema);