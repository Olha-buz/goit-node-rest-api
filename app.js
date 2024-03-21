import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/authRouter.js";



mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Databse connection successeful"))
  .catch((err) => {
    console.log("Database connection error", err);
    process.exit(1);
  });

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter)
app.use("/contacts", contactsRouter);


app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});