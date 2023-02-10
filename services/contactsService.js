const { Contact } = require('../db/contactsModel');
const { NotFound, WrongParametersError } = require('../helpers/errors')


const listContacts = async () => {
    const contacts = await Contact.find({});
    return contacts;
}

const getContactById = async (contactId) => {
    const deletedContact = await Contact.findById(contactId);
    if (!deletedContact) {
        throw new NotFound("Not found")
    }
    return deletedContact;
}
const addContact = async (body) => {
    const { name, email, phone } = body;
    if (!name && !email && !phone) {
        throw new WrongParametersError('Missing Fields');
    }
    const contact = new Contact(body);
    await contact.save();
    return contact;
}
const removeContact = async (contactId) => {
    const deletedContact = await Contact.findByIdAndRemove(contactId);
    if (!deletedContact) {
        throw new NotFound("Not Found")
    }
    return deletedContact;
}


const updateContact = async (contactId, body) => {
    const { name, email, phone } = body;
    if (!name && !email && !phone) {
        throw new WrongParametersError('Missing Fields');
    }
    const updatedContact = await Contact.findByIdAndUpdate(contactId, { $set: body })
    if (updatedContact) {
        const contact = await Contact.findById(contactId)
        return contact;
    } else {
        throw new NotFound('Not Found')
    }
}
const updateStatusContact = async (contactId, body) => {
    const bodyFavorite = body.favorite;
    if (!bodyFavorite) {
        throw new WrongParametersError('Missing Fields')
    }
    const patchedContact = await Contact.findByIdAndUpdate(contactId, { $set: body })
    if (!patchedContact) {
        throw new NotFound('Not Found')
    }
    const updatedStatusContact = await Contact.findById(contactId)
    return updatedStatusContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
}