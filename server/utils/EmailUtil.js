const nodeMailer = require('nodemailer');
const MyConstants = require('./MyConstants');
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: MyConstants.EMAIL_USER,
        pass: MyConstants.EMAIL_PASS
    }
});
const EmailUtil = {
    send(email, id, token) {
        const text = 'Thank for signing up, please input these information to activate your account:\n\t .id: ' + id + '\n\t .token: ' + token;
        return new Promise(function (resolve, reject) {
            const mailOptions = {
                from: MyConstants.EMAIL_USER,
                to: email,
                subject: 'Signup | Verfication',
                text: text
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
};
module.exports = EmailUtil;