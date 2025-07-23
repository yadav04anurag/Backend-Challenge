const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const { roles } = require('../middlewares/roles');

const router = express.Router();

// All routes will use these middlewares
router.use(authController.protect, roles('seller'));

router.route('/')
  .post(productController.createProduct)
  .get(productController.getSellerProducts);
  
router.patch('/rates', productController.updateRates);

router.route('/:id')
  .patch(productController.markAsSold);

module.exports = router;