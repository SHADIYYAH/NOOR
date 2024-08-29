const bcrypt = require('bcryptjs');
const saltRounds = 10;

const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        resolve({ hash, salt });
      });
    });
  });
};

const comparePassword = async (password, hashPassword) => {
  return new Promise((resolve, reject) => {
    let result = bcrypt.compare(password, hashPassword);
    if (result) {
      resolve(result);
    } else {
      reject(err);
    }
  });
};


const generateOtp = (num) => {
    if (num < 2) {
      return Math.floor(1000 + Math.random() * 9000);
    }
    const c = Math.pow(10, num - 1);
  
    return Math.floor(c + Math.random() * 9 * c);
  };

// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
  auth: {
  user: process.env.EMAIL_USER   ||  "", // Your email address
    pass: process.env.EMAIL_PASS  ||"gims leyh lzdz bznq", // Your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: html, // You can use either text or HTML or both
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};



  
  
  module.exports = {hashPassword, comparePassword, generateOtp, sendEmail};


