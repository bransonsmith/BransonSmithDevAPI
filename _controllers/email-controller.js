const express = require("express");
const send = require('gmail-send')({
    user: 'bransonsmithdev@gmail.com',
    pass: 'bsdev316',
    to:   'bransonsmith22@gmail.com',
    subject: 'Message From Website Contact Page',
  });
let router = express.Router();

router.post('/api/emails/send', (req, response) => {
    console.log('POST /api/emails/send');
    console.log(req.body);

    var message = 'From ' + req.body.fromEmail + ' - ' + req.body.message;

    send({
        text:    message,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
    })
    
});

module.exports = router;