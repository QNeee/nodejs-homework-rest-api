const express = require('express')
const Joi = require('joi')
const contacts = [{
  id: '1', name: 'Vasya', phone: '3909232', email: 'sadsa@asda.ua'
}, {
  id: '2', name: 'Igarb', phone: '23213131', email: 'sadsa@asda.ua'
}, {
  id: '3', name: 'Dniwe', phone: '12313212', email: 'sadsa@asda.ua'
}];
const addContact = (body) => {
  return contacts.push(body);
}
const removeContact = (contact) => {
  return contacts.splice(contact, 1);
}
const updateContact = (contactId, body) => {
  const updatedContact = {
    contactId,
    ...body
  }

  return updatedContact;

}
const router = express.Router()
router.get('/', async (req, res, next) => {
  return res.status(200).json({ contacts })
})

router.get('/:contactId', async (req, res, next) => {
  const id = req.params.contactId.toString();
  const [contact] = await contacts.filter(item => item.id === id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ contact })
})

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  const schema = Joi.object({
    name: Joi.string().alphanum()
      .min(3)
      .max(12)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().alphanum()
      .min(3)
      .max(12)
      .required(),
  })
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details })
  }
  const newContact = {
    id: new Date().getTime().toString(),
    name,
    email,
    phone
  }
  await addContact(newContact);
  return res.status(201).json({ newContact })
})

router.delete('/:contactId', async (req, res, next) => {
  const id = req.params.contactId.toString();
  const contact = await contacts.filter(item => item.id === id);

  if (!contact.length) {
    return res.status(404).json({ message: "Not found" })
  }
  await removeContact(contact);
  return res.status(200).json({ message: "contact deleted" })
})

router.put('/:contactId', async (req, res, next) => {
  const id = req.params.contactId.toString();
  if (!req.body.name && !req.body.email && !req.body.phone) {
    return res.status(400).json({ message: "missing fields" })
  }
  const updatedContact = await updateContact(id, req.body);
  if (updatedContact) {
    return res.status(200).json({ updatedContact })
  } else {
    return res.status(404).json({ message: "Not found" })
  }
})

module.exports = router
