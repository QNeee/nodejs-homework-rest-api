const express = require('express')
const router = express.Router()
const { getContactsController,
    addContactsController,
    getContactById,
    changeContactsController,
    deleteContactsController } = require('../controllers/contactsController')

router.get('/', getContactsController);
router.get('/:contactId', getContactById);
router.post('/', addContactsController);
router.put('/:contactId', changeContactsController);
router.delete('/:contactId', deleteContactsController);
module.exports = router;