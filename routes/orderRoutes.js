const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const { roles } = require('../middlewares/roles');

const router = express.Router();

router.use(authController.protect, roles('buyer'));

router.route('/')
  .post(orderController.createOrder)
  .get(orderController.getUserOrders);

module.exports = router;