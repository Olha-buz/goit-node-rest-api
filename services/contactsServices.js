import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


import {Contact} from "../models/contactModels.js";


export const listContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const removeContact = (id) => Contact.findByIdAndDelete(id);


export const addContact = async (value) => {
    try {
        const newContact = value.favorite ? value : { ...value, "favorite": "false" }

        const addContact = await Contact.create(newContact);
        return addContact; 
    } catch (err) {
        console.log(err.message);
    }
    
}

export const contactsService = async (id, data) => {
    try {

        const updateContact = await Contact.findByIdAndUpdate(id, data, { new: true });
        console.log(updateContact);

        return updateContact;
    } catch (err) {
        console.log(err.message);
    }
}

export const updateStatusFavorite = async (id, data) => {
    try {
        const test = await Contact.findById(id);
        console.log(test);
        const statusContact = await Contact.findByIdAndUpdate(id, {favorite: data}, {new: true});
        console.log(statusContact);
        return statusContact;
    } catch (err) {
        console.log(err.message)
    }
}

