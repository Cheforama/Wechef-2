const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: err.message
                });
            }
            req.user = {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                address: decoded.address,
                avatar: decoded.profile
            }
            next();
        });
    } else {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

};


const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;

