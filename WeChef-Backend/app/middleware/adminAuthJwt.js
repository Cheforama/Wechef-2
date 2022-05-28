const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Admin = db.admin;

verifyToken = async (req, res, next) => {
    let token = req.header("x-auth-token");

    if (token) {
        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            const userData = await Admin.findByPk(id);
            req.user = userData;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Token is invalid" });
        }
    } else {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

};


const adminAuthJwt = {
    verifyToken: verifyToken
};

module.exports = adminAuthJwt;

