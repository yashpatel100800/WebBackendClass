const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://yashpatel100800:Yash%402181@yash.ltb0wlc.mongodb.net/test');

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: {type: String, required: true},
    password: {type: String, required: true},
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}