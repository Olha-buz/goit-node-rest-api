import fs from 'fs/promises';
import path from 'path';
import { v4 } from 'uuid';

const __dirname = path.resolve(path.dirname(''));
const contactsPath = path.join(__dirname, 'db', 'contacts.json');

export const listContacts = async () => {

    try {
        const data = await fs.readFile(contactsPath);
        return JSON.parse(data);
    } catch (err) {
        console.log(err.message);
    }
}

export const getContactById = async (contactId) => {

    try {
        const contacts = await listContacts();
        const findContact = contacts.find(contact => contact.id === contactId);
        if (!findContact) {
            return null
        };
        return findContact;
    } catch (err) {
        console.log(err.message);
    }
    
}

export const removeContact = async (contactId) => {

    try {
        const contacts = await listContacts();
        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index === -1) { return null };
        const removeContact = contacts[index];
        contacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(contacts));
        return removeContact;
    } catch (err) {
        console.log(err.message);
    }
    

}

export const addContact = async (name, email, phone) => {

    try {
        const contacts = await listContacts();
        const newContact = {
            id: v4,
            name: name,
            email: email,
            phone: phone,
            
        };
        console.log(newContact);
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts));
        return newContact; 
    } catch (err) {
        console.log(err.message);
    }
    
}

export const contactsService = async (id, data) => {
    try {
        const contacts = await listContacts();
        const index = contacts.findIndex(contact => contact.id === id);
        if (index === -1) { return null; };
        contacts[index] = {
            ...contacts[index],
            ...data
        }
        await fs.writeFile(contactsPath.JSON.stringify(contacts));
        return contacts[index];
    } catch (err) {
        console.log(err.message);
    }
}

// module.exports = {
//     listContacts,
//     getContactById,
//     removeContact,
//     addContact,
//     contactsService,
// }