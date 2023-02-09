const express = require('express')
const router = express.Router()
const { getContactsController,
    postContactsController,
    getContactByIdController,
    updateContactsController,
    deleteContactsController,
    patchContactsFavorite } = require('../controllers/contactsController')

router.get('/', getContactsController);
router.get('/:contactId', getContactByIdController);
router.post('/', postContactsController);
router.put('/:contactId', updateContactsController);
router.delete('/:contactId', deleteContactsController);
router.patch('/:contactId/favorite', patchContactsFavorite)
module.exports = router;