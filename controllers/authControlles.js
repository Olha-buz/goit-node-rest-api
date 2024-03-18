import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

import { User } from "../models/userModels.js";

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user !== null) {
            return res.status(409).send({ "message": "Email in use" })
        };
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: passwordHash
        });
        
        console.log("Register success")

        res.status(201).json({
            "user": {
                email: newUser.email,
                subscription: newUser.subscription
            }
        });
    } catch (err) {
        next(err)
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    try {
        const user = await User.findOne({ email: normalizedEmail });

        if (user === null) {
            return res.status(401).send({ "message": "Email or password is incorrect" })
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
            return res.status(401).send({ "message": "Email or password is incorrect" })
        };

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            } 
        );

        await User.findByIdAndUpdate(user._id, { token });

        console.log("Login success")

        res.json({
            token,
            "user": {
                email: user.email,
                subscription: user.subscription,
            }
        })

    } catch (err) {
        next(err)
    }

};

export const logout = async (req, res, next) => {
    try {
        console.log(req.user._id)
        await User.findByIdAndUpdate(req.user._id, { token: null });
        console.log("Logout success")
        res.status(200).send({message: "Logout success"});
    } catch (err) {
        res.status(401).send('Invalid token !');
    }
};

export const current = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.json({
            email,
            subscription,
        })
    } catch (err) {
        next(err)
    }
};
