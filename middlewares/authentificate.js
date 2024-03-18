import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
configDotenv();
import { User } from "../models/userModels.js";

export const authentificate = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    // console.log(authorizationHeader);
    if (typeof authorizationHeader === "undefined") {
        return res.status(401).send({message: "Invalid token v1"})
    };

    const [bearer, token] = authorizationHeader.split(" ", 2);
    if (bearer !== "Bearer") {
        return res.status(401).send({message: "Invalid token v2"})
    };

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({message: "Token expired"})
            } 
            return res.status(401).send({message: "Invalid token v3"})
        }

        const user = await User.findById(decode.id);

        if (user === null || user.token !== token) {
            return res.status(401).send({message: "Invalid token v4"})
        }

        req.user = user;
        next()
    })


 }
    // const decodeToken = jwt.verify(token, process.env.JWT_SECRET); //WHY IT DOESN'T WORK?????

    // if (!decodeToken) {
    //     console.log(err);
    //     return res.status(401).send({message: "Invalid token v3"})
    // };

    // const user = await User.findById(decodeToken.id);
    // if (!user || user.token !== token) {
    //     return res.status(401).send({ message: "Invalid token v4" })
    // };

    // console.log(user);
    // req.user = user;

    // next()

    // async (err, decode) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(401).send({message: "Invalid token v3"})
    //     }
    //     const user = await User.findById(decode.id);
    //     if (!user || user.token!== token) {
    //         return res.status(401).send({message: "Invalid token v4"})
    //     }
    //     console.log(user);
    //     req.user = {
    //         id: decode.id,
    //         name: decode.name,
    //     }
    //     next()
    // })

    // try {
    //     const decodeToken = jwt.verify(token, JWT_SECRET);
    //     const user = await User.findById(decodeToken.id);
    //     console.log(user);
    //     if (!user || !user.token || user.token !== token) {
    //         return res.status(401).send({ "message": "Invalid token v3" })
    //     };
    //     req.user = user;
    //     next()
    // } catch (err) {
    //     res.status(401).send({"message": "Invalid token v4"})
    // }