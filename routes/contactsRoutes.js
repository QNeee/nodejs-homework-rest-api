const express = require('express')
const router = express.Router()
const { asyncWrapper } = require('../helpers/apiHelpers')
const { getContactsController,
    postContactsController,
    getContactByIdController,
    updateContactsController,
    deleteContactsController,
    patchContactsFavoriteController } = require('../controllers/contactsController');

const { postContactValidation, putContactValidation } = require('../middlewares/validationmiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')
router.use(authMiddleware);
router.get('/', getContactsController);
router.get('/:contactId', asyncWrapper(getContactByIdController));
router.post('/', postContactValidation, asyncWrapper(postContactsController));
router.put('/:contactId', putContactValidation, asyncWrapper(updateContactsController));
router.delete('/:contactId', asyncWrapper(deleteContactsController));
router.patch('/:contactId/favorite', putContactValidation, asyncWrapper(patchContactsFavoriteController))
module.exports = router;