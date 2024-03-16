
import { Schema, model } from "mongoose";

export const userSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
});

export const User = model('users', userSchema);

