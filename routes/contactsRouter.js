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

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", checkId, getOneContact);

contactsRouter.delete("/:id", checkId, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", checkId, updateContact);

contactsRouter.patch("/:id/favorite", checkId, updateStatusContact)

export default contactsRouter;
