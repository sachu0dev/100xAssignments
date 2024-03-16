const express = require('express');
const mongoose = require('mongoose');
const zod = require("zod");
const app = express();
const jwt = require('jsonwebtoken');
const jwtPassword = "secret";
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://admin1:sachu123@cluster0.qjdltxh.mongodb.net/course_selling_app", {
}).then(() => {
    console.log("MongoDB Connected");
}).catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
});

// Schema Validation
const courseSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    imageLink: zod.string(),
    price: zod.number(),
});

const userSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    purchasedCourses: zod.array(zod.string()).optional(),
    type: zod.literal("user")
});

const adminSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    type: zod.literal("admin")
});

// Model Definitions
const Course = mongoose.model("Course", {
    id: String,
    title: String,
    description: String,
    imageLink: String,
    price: Number,
    published: Boolean
});

const User = mongoose.model("User", {
    username: String,
    password: String,
    purchasedCourses: [String],
    type: String
});

const Admin = mongoose.model("Admin", {
    username: String,
    password: String,
    type: String
});

function adminRouter(req, res, next){
    const adminInput = {
        username: req.body.username,
        password: req.body.password,
        type: req.body.type
    }
    const inputAdmin = adminSchema.safeParse(adminInput);
    if(inputAdmin.success){
        next();
    }
    else{
        res.send("invalid input")
    }
}
function userRouter(req, res, next){
    const userInput = {
        username: req.body.username,
        password: req.body.password,
        purchasedCourses: req.body.purchasedCourses,
        type: req.body.type
    }
    const inputCheck = userSchema.safeParse(userInput);
    if(inputCheck.success){
        next();
    }
    else{
        res.send("invalid input")
    }
}
// admins routes
app.post('/admin/signup', adminRouter, async (req, res) => {
    try {
        const adminInput = {
            username: req.body.username,
            password: req.body.password,
            type: req.body.type
        };
        const existingAdmin = await Admin.findOne({ username: adminInput.username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const newAdmin = new Admin(adminInput);
        const token = jwt.sign(adminInput, jwtPassword);
        
        await newAdmin.save();
        
        res.json({
            message: 'Admin created successfully',
            token
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/admin/courses", async (req, res) => {
    const courseInput = {
        title: req.body.title,
        description: req.body.description,
        imageLink: req.body.imageLink,
        price: req.body.price
    };

    try {
        const existingCourse = await Course.findOne({ title: courseInput.title });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course already exists' });
        }

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, jwtPassword);

        const inputCheck = courseSchema.safeParse(courseInput);
        if (!inputCheck.success) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const newCourse = new Course(courseInput);
        await newCourse.save();
        
        res.json({
            message: 'Course created successfully',
            courseId: newCourse._id
        });
    } catch (error) {
        console.error("Error creating course:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send("Unauthorized. Invalid token.");
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).send("Unauthorized. Token has expired.");
        }
        res.status(500).send("Internal Server Error");
    }
});

app.get("/admin/courses", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, jwtPassword);

        const admin = await Admin.findOne({ username: decoded.username });
        if (admin && admin.password === decoded.password) {
            const courses = await Course.find({});
            res.json({ courses });
        } else {
            res.status(403).send("Access denied. Only admins can access this route.");
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send("Internal Server Error");
    }
});

// users routes
app.post("/users/signup", userRouter, async (req, res) => {
    try{
        const userInput = {
            username: req.body.username,
            password: req.body.password,
            type: req.body.type
        }
        const existingUser = await User.findOne({username: userInput.username});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        const newUser = new User(userInput);
        const token = jwt.sign(userInput, jwtPassword);
        newUser.save();
        res.json({
            message: 'User created successfully',
            token
        });
    } catch{
        console.error("Error creating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/users/courses', async (req, res)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, jwtPassword);
        const user = await User.findOne({username: decoded.username});
        console.log(user);
        if(user.password === decoded.password){
              const courses = await Course.find({});
            res.json({ courses });
        } else {
            res.status(403).send("Access denied. Only admins can access this route.");
        }
    } catch{
        res.status(500).send("Internal Server Error");
    }
})
app.post("/users/courses", async (req, res) => {
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, jwtPassword);
        const user = await User.findOne({username: decoded.username});
        if(user.password === decoded.password){
            const courseId = req.query.courseId;
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({message: 'Course not found'});
            }
            if(user.purchasedCourses.includes(courseId)){
                return res.status(400).json({message: 'Course already purchased'});
            }
            user.purchasedCourses.push(courseId);
            user.save();
            res.json({message: 'Course purchased successfully'});
        }
    } 
    catch{
        res.status(500).send("Internal Server Error");
    }
})
app.get("/users/purchasedCourses", async (req, res)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, jwtPassword);
        const user = await User.findOne({username: decoded.username});
        const userCourses = [];
        if(user.password === decoded.password){
            for (const courseId of user.purchasedCourses) {
                const course = await Course.findById(courseId);
                userCourses.push(course);
            }
            res.json({userCourses});
        }
    }
    catch{
        res.status(500).send("Internal Server Error");
    }
})
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});