// import { validate } from "joi";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { listContacts,
    getContactById,
    removeContact,
    addContact,
    contactsService,
    updateStatusFavorite, } from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    try {
        const allContacts = await listContacts();
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
        const id = req.params.id;
        const contact = await getContactById(id);

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
        const id = req.params.id;
        const remove = await removeContact(id);

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
        // console.log(value)

        if (!error) {
            const newContact = await addContact(value);
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
            return res.status(400).json({ "message": 'Not found' })
        };

        const { id } = req.params;
        const update = await contactsService(id, value);
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

// module.exports = {
//     getAllContacts,
//     getOneContact,
//     deleteContact,
//     createContact,
//     updateContact,
// }