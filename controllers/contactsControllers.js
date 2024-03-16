// import { validate } from "joi";

import { isValidObjectId } from "mongoose";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { listContacts,
    getContactById,
    removeContact,
    addContact,
    contactsService,
    updateStatusFavorite, } from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    try {
        const allContacts = await listContacts(req.user);
        if (!allContacts) {
            return res.status(500).json({ "message": 'Something wrong' });
        };
        res.status(200).json(allContacts);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const getOneContact = async (req, res) => {
    try {
    
        const contact = await getContactById(req.params.id, req.user.id);

        if (!contact) {
            return res.status(404).json({ "message": 'Not found' })
        };

        res.status(200).json(contact);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const deleteContact = async (req, res) => {
    try {

        const remove = await removeContact(req.params.id, req.user.id);

        if (!remove) {
            return res.status(404).json({ "message": "Not found" });
        }

        res.status(200).json(remove);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const createContact = async (req, res) => {
    try {
        const { error, value } = createContactSchema.validate(req.body);
        
        if (!error) {
            const newContact = await addContact(value, req.user);
            return res.status(201).json(newContact);
        } else {
            return res.status(400).json({ "message": error.message });
        }
        

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { error, value } = updateContactSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ "message": error.message });
        };
        const bodyLength = Object.keys(value).length;

        if (bodyLength === 0) {
            return res.status(400).json({ "message": 'Body must have at least one field' })
        };

        const update = await contactsService(req.params.id, value, req.user.id);
        if (!update) {
            return res.status(404).json({"message": 'Not found'})
        };
        res.status(200).json(update);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
};

export const updateStatusContact = async (req, res) => {
    try {
        const { id } = req.params;

        const { favorite } = req.body;
        console.log(favorite);
        const updateStatus = await updateStatusFavorite(id, favorite);
        if (!updateStatus) {
            return res.status(404).json({ "message": 'Not found' })
        }
        res.status(200).json(updateStatus)
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ "message": 'Internal Server Error' });
    }
}

export const checkId = async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(404).json({"message": "Id is not valid"})
    }
    next()
}

// module.exports = {
//     getAllContacts,
//     getOneContact,
//     deleteContact,
//     createContact,
//     updateContact,
// }