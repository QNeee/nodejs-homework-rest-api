const { Contact } = require('../db/contactsModel');
const { NotFound, WrongParametersError } = require('../helpers/errors')


const listContacts = async (owner, { limit, skip, favorite }) => {
    if (limit && skip) {
        const contacts = await Contact.find({ owner }).select({ __v: 0 }).skip(skip).limit(limit);
        return contacts;
    } else if (favorite) {
        if (favorite === 'true') {
            favorite = true;
        } else {
            favorite = false;
        }
        const contacts = await Contact.find({ owner }).select({ __v: 0 });
        const filtered = contacts.filter(item => item.favorite === favorite);
        return filtered;
    }
    else {
        const contacts = await Contact.find({ owner }).select({ __v: 0 }).limit(limit);
        return contacts;
    }
}

const getContactById = async (contactId, owner) => {
    const deletedContact = await Contact.findOne({ contactId, owner });
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
const removeContact = async (contactId, owner) => {
    const deletedContact = await Contact.findOneAndRemove({ contactId, owner });
    if (!deletedContact) {
        throw new NotFound("Not Found")
    }
    return deletedContact;
}


const updateContact = async (id, owner, body) => {
    const { name, email, phone } = body;
    if (!name && !email && !phone) {
        throw new WrongParametersError('Missing Fields');
    }
    const updatedContact = await Contact.findOneAndUpdate({ _id: id, owner }, { $set: body })
    if (updatedContact) {
        const contact = await Contact.findById(id)
        return contact;
    } else {
        throw new NotFound('Not Found')
    }
}
const updateStatusContact = async (id, owner, body) => {
    const bodyFavorite = body.favorite;
    if (!bodyFavorite) {
        throw new WrongParametersError('Missing Fields favorite')
    }
    const patchedContact = await Contact.findOneAndUpdate({ _id: id, owner }, { $set: body })
    if (!patchedContact) {
        throw new NotFound('Not Found')
    }
    const updatedStatusContact = await Contact.findById(id)
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