const express = require('express')
const router = express.Router()
const { getContactsController,
    postContactsController,
    getContactByIdController,
    updateContactsController,
    deleteContactsController,
    patchContactsFavorite } = require('../controllers/contactsController');

const { postContactValidation, putContactValidation } = require('../middlewares/validationmiddleware')
router.get('/', getContactsController);
router.get('/:contactId', getContactByIdController);
router.post('/', postContactValidation, postContactsController);
router.put('/:contactId', putContactValidation, updateContactsController);
router.delete('/:contactId', deleteContactsController);
router.patch('/:contactId/favorite', putContactValidation, patchContactsFavorite)
module.exports = router;