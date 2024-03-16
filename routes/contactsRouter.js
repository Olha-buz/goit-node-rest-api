import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
  checkId,
} from "../controllers/contactsControllers.js";
import {authentificate} from "../middlewares/authentificate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authentificate, getAllContacts);

contactsRouter.get("/:id", authentificate, checkId, getOneContact);

contactsRouter.delete("/:id", authentificate, checkId, deleteContact);

contactsRouter.post("/", authentificate, createContact);

contactsRouter.put("/:id", authentificate, checkId, updateContact);

contactsRouter.patch("/:id/favorite", authentificate, checkId, updateStatusContact)

export default contactsRouter;
