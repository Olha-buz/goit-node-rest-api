import { Schema, model } from "mongoose";

const contactShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    }
});

export const Contact = model('Contact', contactShema);
