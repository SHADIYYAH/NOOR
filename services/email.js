const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const readMyFileAndReturnPromise = (dirpath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dirpath, { encoding: "utf-8" }, (err, fileRead) => {
      if (err) {
        reject(err);
      }
      resolve(fileRead);
    });
  });
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const readFileAndSendEmail = async (
  userEmail,
  emailHeader,
  dataReplacement,
  filename
) => {
  let dirpath = path.join(__dirname, `../views/${filename}.html`);

  let readTheFile = await readMyFileAndReturnPromise(dirpath);
  const template = Handlebars.compile(readTheFile);
  const result = template(dataReplacement);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: emailHeader,
    html: result,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

module.exports = { readFileAndSendEmail };
