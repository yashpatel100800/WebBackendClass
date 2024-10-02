const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const {User} = require("../db");

async function userMiddleware (req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtSecret)
    if(!decoded.username){
        res.status(401).send("Unauthorized access of Token")
        return
    }else{
        const usernameResult = await User.findOne({username: decoded.username})
        console.log(usernameResult)
        if(!usernameResult){
            res.status(401).send("Not user credentials")
            return
        }
        else{
            next()
        }
    }
}

module.exports = userMiddleware;