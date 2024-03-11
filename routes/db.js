import mongoose from "mongoose";

const BD_URI = process.env.DB_URI;

mongoose
    .connect(DB_URI)
    .then(() => console.log("Databse connection successeful"))
    .catch((err) => console.log("Database connection error", err));
