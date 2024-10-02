const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin,Course } = require("../db");
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    try{
        const adminExist  = await Admin.findOne({username: username})
        console.log(adminExist)
        if(adminExist){
            res.status(400).send("Admin already Exist")
            return
        }else{
            const newAdmin = new Admin({
                username: username,
                password: password
            })
            await newAdmin.save()
            const token = jwt.sign({username: username}, jwtSecret)
            res.status(201).send({token: token})
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }

});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    try{
        const adminExist  = await Admin.findOne({username: username, password: password})
        if(!adminExist){
            res.status(400).send("Username or Password is Incorrect")
            return
        }else{
            const token = jwt.sign({username: username}, jwtSecret)
            res.status(201).send({token: token})
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title
    try{
        const decoded = jwt.verify(req.headers.authorization, jwtSecret)
        const course = await Course.findOne({title: title})
        const adminId = await Admin.findOne({username: decoded.username})
        if(course){
            res.status(400).send("Course already Exist")
            return
        }else{
            const newCourse = new Course({
                title: title,
                description: req.body.description,
                price: req.body.price,
                admin: adminId,
                users: []
            })
            await newCourse.save()
            res.status(201).send("Course Created")
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try{
        const adminid = await Admin.findOne({username:jwt.verify(req.headers.authorization, jwtSecret).username})
        const courses = await Course.find({admin: adminid})
        if(!courses){
            res.status(400).send("No Courses Found")
            return
        }else{
            res.status(200).send(courses)
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router;