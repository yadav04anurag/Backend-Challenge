// In a real app, this would send actual emails
// For this challenge, we'll just log to console
module.exports = {
  sendOTP: (email, otp) => {
    console.log(`OTP for ${email}: ${otp}`);
    return true;
  },
  sendNotification: (email, message) => {
    console.log(`Notification sent to ${email}: ${message}`);
    return true;
  }
};