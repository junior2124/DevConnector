const nodemailer = require("nodemailer");
const keys = require("../config/keys");

module.exports = function userPasswordResetEmail(data) {
  let errors = {};

  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: keys.gmailUser,
        pass: keys.gmailKey
      }
    });

    let mailOptions = {
      from: '"Emilio Escobedo" ' + keys.gmailUser,
      to: data.email,
      subject: "Reset User Password",
      text:
        "Please follow the link in order to reset your password: " +
        keys.homeURL +
        "/changepassword/" +
        data.xid,
      html:
        "<b>Please follow the link in order to reset your password: </b><a href='" +
        keys.homeURL +
        "/changepassword/" +
        data.xid +
        "'>Reset Password</a>"

      // attachments: [
      //   // String attachment
      //   {
      //     filename: "notes.txt",
      //     content: "Some notes about this email",
      //     contentType: "text/plain"
      //   }
      // ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });

  return "Reset Email Sent";
};
