import express from "express";
import { current, login, logout, register, resendVerifyEmail, uploadAvatar, verifyEmail } from "../controllers/authControlles.js";
import { authentificate } from "../middlewares/authentificate.js";
import { upload } from "../middlewares/upload.js";
import validateBody from "../helpers/validateBody.js";
import { emailSchema, loginSchema, registerSchema } from "../schemas/userSchemas.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post("/register", validateBody(registerSchema), jsonParser, register);
userRouter.post("/login", validateBody(loginSchema), jsonParser, login);
userRouter.post("/logout", authentificate, logout);
userRouter.get("/current", authentificate, current);
userRouter.get("/verify/:verifyToken", verifyEmail);
userRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);
userRouter.patch("/avatars", authentificate, upload.single("avatar"), uploadAvatar);

export default userRouter;