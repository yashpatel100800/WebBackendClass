const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const {Admin} = require("../db");
// Middleware for handling auth
async function adminMiddleware (req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtSecret)
    if(!decoded.username){
        res.status(401).send("Unauthorized access of token")
        return
    }else{
        const usernameResult = await Admin.findOne({username: decoded.username})
        if(!usernameResult){
            res.status(401).send("Not admin credentials")
            return
        }
        else{
            next()
        }
    }
}

module.exports = adminMiddleware;