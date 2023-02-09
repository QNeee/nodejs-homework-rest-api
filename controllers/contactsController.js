const { Contact } = require('../db/contactsModel');

const getContactsController = async (req, res) => {
    const contacts = await Contact.find({});
    return res.status(200).json({ contacts });
}
const getContactById = async (req, res) => {
    const id = req.params.contactId;
    const contact = await Contact.findById(id);
    if (!contact) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ contact })
}
const addContactsController = async (req, res) => {
    const { name, email, phone } = req.body;
    const contact = new Contact({ name, phone, email });
    await contact.save();
    return res.status(200).json({ contact, status: 'success' })
}
const changeContactsController = async (req, res) => {
    const id = req.params.contactId;
    const { name, email, phone } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(id, { $set: { name, email, phone } })
    if (updatedContact) {
        return res.status(200).json({ updatedContact })
    } else {
        return res.status(404).json({ message: "Not found" })
    }
}
const deleteContactsController = async (req, res) => {
    const id = req.params.contactId;
    const deletedContact = await Contact.findByIdAndRemove(id);
    if (deletedContact) {
        return res.status(200).json({ deletedContact, message: "contact deleted" })
    } else {
        return res.status(404).json({ message: "Not found" })
    }
}
module.exports = {
    getContactsController,
    addContactsController,
    getContactById,
    changeContactsController,
    deleteContactsController
}