import { Schema, model } from 'mongoose';
const buyEntrySchema = new Schema({
    pid: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    unit: {
        type: Number,
        required: true,
    },
    perUnitPrice: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    date:{
        type:Date,
        required:true
    },
    addedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    // collection: 'studentledgers'
});
export default model('buyEntry', buyEntrySchema);