import { validate } from "joi";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { listContacts,
    getContactById,
    removeContact,
    addContact,
    contactsService, } from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    try {
        const allContacts = await listContacts();
        if (!allContacts) res.status(500).json({ "message": 'Something wrong' });
        res.status(200).json({ allContacts });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const getOneContact = async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await getContactById(id);
        if (!contact) res.status(404).json({"message": 'Not found'})
        res.status(200).json({ contact });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const id = req.params.id;
        const remove = await removeContact(id);
        if (!remove) res.status(404).json({ "message": "Not found" });
        res.status(200).json({ remove });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const createContact = async (req, res) => {
    try {
        const { error, name, email, phone } = createContactSchema.validate(req.body);
        if (error) {
            res.status(400).json({ "message": error.message });
        }
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { error, value } = updateContactSchema.validate(req.body)
        if (error) res.status(400).json({ "message": error.message });
        const bodyLength = Object.keys(value).length;
        if (bodyLength === 0) res.status(400).json({ "message": 'Whaaat?' })
        const { id } = req.params;
        const update = await contactsService(id, value);
        if (!update) {
            return res.status(404).json({"message": 'Not found'})
        };
        res.status(200).json({ update });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

// module.exports = {
//     getAllContacts,
//     getOneContact,
//     deleteContact,
//     createContact,
//     updateContact,
// }