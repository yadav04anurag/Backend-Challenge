const { Order } = require('../models/Order');
const { Product } = require('../models/Product');
const { AppError } = require('../utils/appError');
const { User } = require('../models/User');

const createOrder = async (req, res, next) => {
  try {
    const { productId, paymentMethod } = req.body;

    if (!productId || !paymentMethod) {
      return next(new AppError('Please provide product ID and payment method', 400));
    }

    const product = await Product.findById(productId).populate('seller');
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    if (product.isSold || product.stock <= 0) {
      return next(new AppError('This product is not available for purchase', 400));
    }

    const order = await Order.create({
      buyer: req.user.id,
      product: productId,
      paymentMethod
    });

    product.stock -= 1;
    if (product.stock === 0) {
      product.isSold = true;
    }
    await product.save();

    const io = req.app.get('io');
    const notificationController = require('./notificationController');
    
    await notificationController.sendNotification(
      product.seller._id,
      `New order received for product ${product._id}`,
      io
    );

    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate('product');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getUserOrders
};