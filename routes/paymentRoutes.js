const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/process', authController.protect, paymentController.processPayment);

module.exports = router;