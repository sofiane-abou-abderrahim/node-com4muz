const express = require('express');
const uuid = require('uuid');

const contData = require('../../util/contact-data');

const router = express.Router();

router.post('/contact', function (req, res) {
  const contact = req.body;
  contact.id = uuid.v4();

  const contacts = contData.getStoredContacts();

  contacts.push(contact);

  contData.storeContacts(contacts);

  res.redirect('/contact');
});

module.exports = router;
