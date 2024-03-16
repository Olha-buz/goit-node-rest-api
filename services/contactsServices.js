import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


import {Contact} from "../models/contactModels.js";


export const listContacts = (ownerId) => Contact.find(ownerId);

export const getContactById = (id, ownerId) => Contact.findById({ _id: id, ownerId });

export const removeContact = (id, ownerId) => Contact.findByIdAndDelete({ _id: id, ownerId });


export const addContact = async (value, ownerId) => {
    try {
        const newContact = value.favorite ? { ...value, ownerId } : { ...value, "favorite": "false", ownerId }

        const addContact = await Contact.create(newContact);
        return addContact; 
    } catch (err) {
        console.log(err.message);
    }
    
}

export const contactsService = async (id, data, ownerId) => {
    try {

        const updateContact = await Contact.findByIdAndUpdate(id, data, { new: true }).where("ownerId").equals(ownerId);
        console.log(updateContact);

        return updateContact;
    } catch (err) {
        console.log(err.message);
    }
}

export const updateStatusFavorite = async (id, data, ownerId) => {
    try {
        const test = await Contact.findById(id, ownerId);
        console.log(test);
        const statusContact = await Contact.findByIdAndUpdate(id, {favorite: data}, {new: true});
        console.log(statusContact);
        return statusContact;
    } catch (err) {
        console.log(err.message)
    }
}

