import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import * as fs from "fs";
import * as path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { User } from "../models/userModels.js";
import nodemailer from "nodemailer";
import { transport } from "../helpers/transport.js";


export const register = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (user !== null) {
            return res.status(409).send({ "message": "Email in use" })
        };
        
        const avatarURL = gravatar.url(email);

        const passwordHash = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomUUID();

        const newUser = await User.create({ ...req.body, avatarURL, password: passwordHash, verifyToken });
        
        await transport.sendMail({                                        // sendEmail
            to: email,
            from: "buzak.olha@ukr.net",
            subject: "Verification for Phonebook",
            html: `To confirm your registration please click on the <a href="http://localhost:3000/users/verify/${verifyToken}">Click me</a>`,
            text: `To confirm your registration please click on the link http://localhost:3000/users/verify/${verifyToken}`
        });   

        res.status(201).json({
            "user": {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
                verifyToken,
            }
        });
    } catch (err) {
        next(err)
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (user === null) {
            return res.status(401).send({ "message": "Email or password is incorrect" })
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
            return res.status(401).send({ "message": "Email or password is incorrect" })
        }; 
        // check verify
        if (user.verify === false) {
            return res.status(400).send({message: "Your email is not verified"})
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
        res.status(204).end();
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

const avatarsDir = path.resolve("public", "avatars");
export const uploadAvatar = async (req, res, next) => {
    console.log(req.file);
    try {
        if (!req.file) {
            return res.status(404).send({ message: "Add your file" })
        }

        const { path: tmpFile } = req.file;

        const img = await Jimp.read(tmpFile);
        await img.resize(250, 250).quality(60).write(tmpFile);

        await fs.rename(
            tmpFile,
            path.join(process.cwd(), "public", "avatars", req.file.filename),
            (err) => {
                console.log("err", err);
            }
        );

        const avatarURL = path.join("avatars", req.file.filename);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL },
            { new: true }
        );

        res.status(200).json({ avatarURL });
    } catch (err) {
        next(err);
    }

};

export const verifyEmail = async (req, res, next) => {
    const { verifyToken } = req.params;
    console.log(verifyToken);
    try {
        const user = await User.findOne({ verifyToken });
        if (user === null) {
            return res.status(404).send({ message: "User not found" });
        };

        console.log("verifyEmail>>", user);

        await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });
        res.status(200).send({ message: "Verification successfully" });
    } catch (err) {
        next(err);
    }

};

export const resendVerifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (email === null) {
            return res.status(400).send({ message: "Email is required field" })
        }
        const user = await User.findOne({ email });
        console.log("resendVerifyEmail>>", user);
        if (user === null) {
            return res.status(404).send({message: "User not found"})
        };
        if (user.verify) {
            return res.status(404).send({message: "Verification has already been pased"})
        };

        await transport.sendMail({                                        // sendEmail
            to: email,
            from: "buzak.olha@ukr.net",
            subject: "Verification for Phonebook",
            html: `To confirm your registration please click on the <a href="http://localhost:3000/users/verify/${user.verifyToken}">Click me</a>`,
            text: `To confirm your registration please click on the link http://localhost:3000/users/verify/${user.verifyToken}`
        });   

        // await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });
        res.status(200).send({message: "Email for verify is sent"})
    } catch (err) {
        next(err)
    }
};
