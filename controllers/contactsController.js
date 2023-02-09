const { Contact } = require('../db/contactsModel');
const listContacts = async () => {
    const contacts = await Contact.find({});
    return contacts;
}

const getContactById = async (contactId) => {
    const deletedContact = await Contact.findById(contactId);
    return deletedContact;
}

const removeContact = async (contactId) => {
    const deletedContact = await Contact.findByIdAndRemove(contactId);
    return deletedContact;
}

const addContact = async (body) => {
    const contact = new Contact(body);
    return contact;
}

const updateContact = async (contactId, body) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, { $set: body })
    return updatedContact;
}
const updateStatusContact = async (contactId, body) => {
    const updatedStatusContact = await Contact.findByIdAndUpdate(contactId, { $set: body })
    return updatedStatusContact;
}
const getContactsController = async (req, res) => {
    const contacts = await listContacts();
    return res.status(200).json({ contacts });
}
const getContactByIdController = async (req, res) => {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    if (!contact) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ contact })
}
const postContactsController = async (req, res) => {
    const { name, email, phone, favorite } = req.body;
    const newContact = {
        name,
        email,
        phone,
        favorite: !!favorite
    }
    if (name && email && phone) {
        const contact = await addContact(newContact);
        await contact.save();
        return res.status(200).json({ contact, status: 'success' })
    }
    return res.status(404).json({ message: "no Body" })
}
const updateContactsController = async (req, res) => {
    const id = req.params.contactId;
    const { name, email, phone } = req.body;
    if (name && email && phone) {
        const updatedContact = await updateContact(id, req.body)
        if (updatedContact) {
            const contact = await Contact.findById(id)
            return res.status(200).json({ contact, message: 'success' })
        } else {
            return res.status(404).json({ message: "Not found" })
        }
    } else {
        return res.status(403).json({ message: "Not body" })
    }
}
const deleteContactsController = async (req, res) => {
    const id = req.params.contactId;
    const deletedContact = await removeContact(id);
    if (deletedContact) {
        return res.status(200).json({ deletedContact, message: "contact deleted" })
    } else {
        return res.status(404).json({ message: "Not found" })
    }
}
const patchContactsFavorite = async (req, res) => {
    const id = req.params.contactId;
    const bodyFavorite = req.body.favorite;
    if (!bodyFavorite) {
        return res.status(400).json({ message: "missing field favorite" })
    }
    const patchedContact = await updateStatusContact(id, req.body);
    if (patchedContact) {
        const contact = await Contact.findById(id)
        return res.status(200).json({ contact })
    } else {
        return res.status(404).json({ message: "Not found" })
    }
}
module.exports = {
    getContactsController,
    postContactsController,
    getContactByIdController,
    updateContactsController,
    deleteContactsController,
    patchContactsFavorite
}