const express = require('express');

const router = express.Router();

router.get('/confirmation', function (req, res) {
  res.render('confirmation');
});

router.get('/a-propos', function (req, res) {
  res.render('a-propos');
});

router.get('/services', function (req, res) {
  res.render('services');
});

router.get('/portefeuille', function (req, res) {
  res.render('portefeuille');
});

router.get('/contact', function (req, res) {
  res.render('contact');
});

module.exports = router;
