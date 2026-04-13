const { Resend } = require('resend');
const resend = new Resend('re_ENnrSzr2_KPF8iBFCoTTXgQaEPZ3w53QN');

const EmailUtil = {
    async send(email, id, token) {
        const text = 'Thank for signing up, please input these information to activate your account:\n\t .id: ' + id + '\n\t .token: ' + token;
        return resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Signup | Verification',
            text: text
        });
    }
};

module.exports = EmailUtil;