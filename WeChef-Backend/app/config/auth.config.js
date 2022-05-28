require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET,

    email: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },

    frontend: {
        host: process.env.FRONTEND_HOST
    }
      
};