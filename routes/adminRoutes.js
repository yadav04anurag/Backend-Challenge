const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { roles } = require('../middlewares/roles');

const router = express.Router();

router.use(authController.protect);
router.use(roles('admin'));

router.route('/users')
  .get(adminController.getAllUsers);

router.route('/users/:id')
  .delete(adminController.deleteUser);

module.exports = router;