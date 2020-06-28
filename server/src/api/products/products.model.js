import { Schema, model } from 'mongoose';
const productSchema = new Schema({
    brand: {
        type: String,
        required: true,
        min: 1,
        max: 1000,
    },
    sid: {
        type: String,
        required: true,
        min: 1,
        max: 1000,
    },
    brandId: {
        type: String,
        required: true,
        min: 1,
        max: 1000,
    },
    size: {
        type: String,
        required: true,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
        required: true,
    },
    addedBy: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },order: {
        type: Number,
        default: -1,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
export default model('product', productSchema);