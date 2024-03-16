import express from "express";
import { current, login, logout, register } from "../controllers/authControlles.js";
import { authentificate } from "../middlewares/authentificate.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post("/register", jsonParser, register);
userRouter.post("/login", jsonParser, login);
userRouter.post("/logout", authentificate, logout);
userRouter.get("/current", authentificate, current);

export default userRouter;