import express from "express";
import { current, login, logout, register } from "../controllers/authControlles.js";
import { authentificate } from "../middlewares/authentificate.js";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/userSchemas.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post("/register", validateBody(registerSchema), jsonParser, register);
userRouter.post("/login", validateBody(loginSchema), jsonParser, login);
userRouter.post("/logout", authentificate, logout);
userRouter.get("/current", authentificate, current);

export default userRouter;