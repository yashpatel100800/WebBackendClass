const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const e = require("express");
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const { Course,User } = require("../db");

// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const username = req.body.username
    const password = req.body.password
    try{
        const userExist  = await User.findOne({username: username})
        console.log(userExist)
        if(userExist){
            res.status(400).send("User already Exist")
            return
        }else{
            const newUser = new User({
                username: username,
                password: password
            })
            await newUser.save()
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
        const userExist  = await User.findOne({username: username, password: password})
        if(!userExist){
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find()
    if(courses){
        res.status(200).send(courses)
    }else{
        res.status(404).send("No courses found")
    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId
    const user = await User.findOne({username: jwt.verify(req.headers.authorization, jwtSecret).username})
    const course = await Course.findOne({_id: courseId})
    if(!course){
        res.status(404).send("Course Not Found")
        return
    }else{
        console.log(course.users)
        console.log(user)
        if(course.users.includes(user._id)){
            res.status(400).send("Course Already Purchased")
            return
        }else{
            course.users.push(user)
            await course.save()
            res.status(200).send("Course Purchased")
        }
        
    }

});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    try{
        const user = await User.findOne({username: jwt.verify(req.headers.authorization, jwtSecret).username})
        const courses = await Course.find({users:{ $all: [user]}})
        if(!courses){
            res.status(404).send("No Courses Found")
            return
        }else{
            res.status(200).send(courses)
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router