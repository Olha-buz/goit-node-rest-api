import express from "express";
import { current, login, logout, register, uploadAvatar } from "../controllers/authControlles.js";
import { authentificate } from "../middlewares/authentificate.js";
import { upload } from "../middlewares/upload.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post("/register", jsonParser, register);
userRouter.post("/login", jsonParser, login);
userRouter.post("/logout", authentificate, logout);
userRouter.get("/current", authentificate, current);
userRouter.patch("/avatar", authentificate, upload.single("avatar"), uploadAvatar);

export default userRouter;