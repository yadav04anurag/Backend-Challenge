const { User } = require('../models/User');
const { signToken, verifyToken } = require('../config/jwt');
const { AppError } = require('../utils/appError');
const otpGenerator = require('otp-generator');
const validator = 'validator';
const { sendOTP } = require('../utils/email');

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
};

const signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return next(new AppError('Please provide email, password, and role', 400));
    }

    if (!validator.isEmail(email)) {
      return next(new AppError('Please provide a valid email', 400));
    }

    if (!['admin', 'seller', 'buyer'].includes(role)) {
      return next(new AppError('Invalid role specified', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const otp = generateOTP();
    const otpExpires = new Date(
      Date.now() + process.env.OTP_EXPIRE_MINUTES * 60 * 1000
    );

    const newUser = await User.create({
      email,
      password,
      role,
      otp,
      otpExpires,
      isVerified: false
    });

    sendOTP(email, otp);

    if (role !== 'admin') {
      const adminUsers = await User.find({ role: 'admin' });
      const io = req.app.get('io');
      const notificationController = require('./notificationController');

      adminUsers.forEach(async (admin) => {
        await notificationController.sendNotification(
          admin._id,
          `New ${role} signup: ${email}`,
          io
        );
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'OTP sent to your email. Please verify your account.',
      data: {
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new AppError('Please provide email and OTP', 400));
    }

    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
      return next(new AppError('User is already verified', 400));
    }

    if (user.otp !== otp) {
      return next(new AppError('Invalid OTP', 400));
    }

    if (user.otpExpires < new Date()) {
      return next(new AppError('OTP has expired', 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Account verified successfully'
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    if (!user.isVerified) {
      return next(new AppError('Please verify your account first', 401));
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = verifyToken(token);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  verify,
  login,
  protect
};