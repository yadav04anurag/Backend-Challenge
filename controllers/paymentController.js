const processPayment = (req, res, next) => {
  setTimeout(() => {
    const success = Math.random() > 0.2;
    res.status(200).json({
      success,
      message: success ? 'Payment processed successfully' : 'Payment failed'
    });
  }, 2000);
};

module.exports = {
  processPayment
};