const { Product } = require('../models/Product');
const { AppError } = require('../utils/appError');
const { User } = require('../models/User');


const createProduct = async (req, res, next) => {
  try {
    const { height, width, material, rate, stock } = req.body;

    if (!height || !width || !material || !rate || !stock) {
      return next(new AppError('Please provide all product details', 400));
    }

    const newProduct = await Product.create({
      seller: req.user.id,
      height,
      width,
      material,
      rate,
      stock,
      isSold: false
    });

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    });
  } catch (err) {
    next(err);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (err) {
    next(err);
  }
};

const markAsSold = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      { isSold: true },
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    const adminUsers = await User.find({ role: 'admin' });
    const io = req.app.get('io');
    const notificationController = require('./notificationController');

    adminUsers.forEach(async (admin) => {
      await notificationController.sendNotification(
        admin._id,
        `Product ${product._id} has been marked as sold by seller ${req.user.email}`,
        io
      );
    });

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateRates = async (req, res, next) => {
  try {
    const { material, increase } = req.query;

    if (!material || !increase) {
      return next(new AppError('Please provide material and increase parameters', 400));
    }

    const parsedIncrease = parseFloat(increase);
    if (isNaN(parsedIncrease)) {
      return next(new AppError('Increase must be a number', 400));
    }

    const updatedProducts = await Product.updateMany(
      { material, seller: req.user.id },
      { $inc: { rate: parsedIncrease } }
    );

    res.status(200).json({
      status: 'success',
      message: `Updated rates for ${updatedProducts.nModified} products`,
      data: {
        updatedCount: updatedProducts.nModified
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getSellerProducts,
  markAsSold,
  updateRates
};