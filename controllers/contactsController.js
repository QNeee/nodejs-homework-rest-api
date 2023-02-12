
const { listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact, } = require('../services/contactsService')

const getContactsController = async (req, res) => {
    const { _id: owner } = req.user;
    const limitNumber = 5;
    let {
        page = 1,
        limit = limitNumber,
        skip = 0,
        favorite
    } = req.query;
    if (page && limit) {
        limit = parseInt(limit) > limitNumber ? limitNumber : parseInt(limit);
        skip = parseInt(page) === 1 ? skip.toString() : parseInt(page) * limit - limitNumber;
        const contacts = await listContacts(owner, { limit, skip });
        return res.status(200).json({ contacts });
    } else if (favorite) {
        favorite = favorite.toString();
        const contacts = await listContacts(owner, { favorite });
        return res.status(200).json({ contacts });
    }
    else {
        const contacts = await listContacts(owner, { limit });
        return res.status(200).json({ contacts });
    }

}
const getContactByIdController = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const contact = await getContactById(contactId, owner);
    return res.status(200).json({ contact })
}
const postContactsController = async (req, res) => {
    const { name, email, phone, favorite } = req.body;
    const { _id } = req.user;
    const newContact = {
        name,
        email,
        phone,
        favorite,
        owner: _id
    }
    const contact = await addContact(newContact);
    return res.status(201).json({ contact, status: 'success' })

}
const updateContactsController = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, owner, req.body)
    return res.status(200).json({ updatedContact, message: 'success' })
}
const deleteContactsController = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const deletedContact = await removeContact(contactId, owner);
    return res.status(200).json({ deletedContact, message: "contact deleted" })
}
const patchContactsFavoriteController = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const patchedContact = await updateStatusContact(contactId, owner, req.body);
    return res.status(200).json({ patchedContact })
}
module.exports = {
    getContactsController,
    postContactsController,
    getContactByIdController,
    updateContactsController,
    deleteContactsController,
    patchContactsFavoriteController
}