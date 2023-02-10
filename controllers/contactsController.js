
const { listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact, } = require('../services/contactsService')

const getContactsController = async (req, res) => {
    const contacts = await listContacts();
    return res.status(200).json({ contacts });
}
const getContactByIdController = async (req, res) => {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    return res.status(200).json({ contact })
}
const postContactsController = async (req, res) => {
    try {
        const { name, email, phone, favorite } = req.body;
        const newContact = {
            name,
            email,
            phone,
            favorite
        }
        const contact = await addContact(newContact);
        return res.status(201).json({ contact, status: 'success' })
    } catch (error) {
        return res.json({ error });
    }

}
const updateContactsController = async (req, res) => {
    const id = req.params.contactId;
    const updatedContact = await updateContact(id, req.body)
    return res.status(200).json({ updatedContact, message: 'success' })
}
const deleteContactsController = async (req, res) => {
    const id = req.params.contactId;
    const deletedContact = await removeContact(id);
    return res.status(200).json({ deletedContact, message: "contact deleted" })
}
const patchContactsFavoriteController = async (req, res) => {
    const id = req.params.contactId;
    const patchedContact = await updateStatusContact(id, req.body);
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