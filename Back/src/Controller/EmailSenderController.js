const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const env = require('../Config/env')
// EMAIL DE QUEM VAI ENVIAR
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.email,
        pass: env.senhaPessoal
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve(__dirname,'/src/templates')
    },
    viewPath: './templates',
    extName: '.html'
}))

function getDateString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}



function forgotUser(to, name, token) {
    var mail = {
        template: "forgotPassword",
        from: env.email,
        to: to,
        subject: "Esqueceu sua senha? Recupere agora! 😉",
        context: {
            token: token,
            name: name,
        }
    }
    return mail
}


function validateEmail(to, name, token) {
    var mail = {
        template: "validateEmail",
        from: env.email,
        to: to,
        subject: "Validação de Email",
        context: {
            name: name,
            token:token
        }
    }
    return mail
}

module.exports = {
    async sendforgotUser(to, name, token) {
        var email = forgotUser(to, name, token);
        try {
            transporter.sendMail(email);
            return { status: 200, message: `E-mail enviado com Sucesso para ${to}, verifique a Caixa de Entrada/Spam/Lixeira` };
        } catch (error) {
            return { status: 400, message: 'Não é possível enviar e-mail para recuperar a senha' }
        }    
    },

    async sendValidateEmail(to, email,token){
        var sendEmail = validateEmail(to, email,token);
        try {
            transporter.sendMail(sendEmail);
            console.log(sendEmail)
            return { status: 200, message: 'Codigo de validação de email enviado com Sucesso' };
        } catch(error) {
            return { status: 400, message: 'Não foi possível enviar o e-mail com o code de validação' }
        }
    },
}