const express = require("express");
var nodemailer = require('nodemailer');
// const send = require('gmail-send')({
//     user: 'bransonsmithdev@gmail.com',
//     pass: 'bsdev316',
//     to:   'bransonsmith22@gmail.com',
//     subject: 'Message From Website Contact Page',
//   });
let router = express.Router();

router.post('/api/emails/send', (req, response) => {
    
    var message = 'From ' + req.body.fromEmail + ' - ' + req.body.message;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bransonsmithdev@gmail.com',
            pass: 'bsdev316'
        }
    });
    
    var mailOptions = {
        from: 'bransonsmithdev@gmail.com',
        to: 'bransonsmith22@gmail.com',
        subject: 'Message From Website Contact Page',
        text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

module.exports = router;







