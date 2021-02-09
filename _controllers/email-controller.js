const express = require("express");
const nodemailer = require("nodemailer");
// const send = require('gmail-send')({
//     user: 'bransonsmithdev@gmail.com',
//     pass: 'bsdev316',
//     to:   'bransonsmith22@gmail.com',
//     subject: 'Message From Website Contact Page',
//   });
let router = express.Router();

router.post('/api/emails/send', (req, response) => {
    
    var message = 'From ' + req.body.fromEmail + ' - ' + req.body.message;

    try {// Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `"bransonsmithdev" <${testAccount.user}@ethereal.com>`, // sender address
          to: "bransonsmith22@gmail.com",
          subject: "Message From www.bransonsmithdev.com Contact Page", // Subject line
          text: message
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    } catch (e) {
        consol.log('Email Error:');
        console.log(e);
    }
});

module.exports = router;







