const express = require('express');
const uuid = require('uuid');

const quotData = require('../../util/quotation-data');

const router = express.Router();

router.get('/', function (req, res) {
  const storedQuotations = quotData.getStoredQuotations();

  res.render('index', { usernameQuotation: storedQuotations.length });
});

router.post('/', function (req, res) {
  const quotation = req.body;
  quotation.id = uuid.v4();

  const quotations = quotData.getStoredQuotations();

  quotations.push(quotation);

  quotData.storeQuotations(quotations);

  res.redirect('/');
});

module.exports = router;
