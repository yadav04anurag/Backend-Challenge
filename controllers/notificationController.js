const { Notification } = require('../models/Notification');
const { AppError } = require('../utils/appError');

const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: {
        notifications
      }
    });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return next(new AppError('No notification found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        notification
      }
    });
  } catch (err) {
    next(err);
  }
};

const sendNotification = async (userId, message, io) => {
  try {
    const notification = await Notification.create({
      user: userId,
      message
    });

    io.to(userId.toString()).emit('notification', {
      message,
      notificationId: notification._id,
      createdAt: notification.createdAt
    });

    return notification;
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  sendNotification
};