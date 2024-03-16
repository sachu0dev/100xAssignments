const express = require('express');
const jwt = require('jsonwebtoken');
const zod = require("zod");
const app = express();
app.use(express.json());

let token = "";
const jtwSecret = "secret";
const schema = zod.object({
    email : zod.string().email(),
    password : zod.string().max(6)
})

function checkInputs(req, res, next){
    const user = schema.safeParse(req.body);
    if(user.success){
        next()
    }
    else{
        res.send("invalid input")
    }
}
function signinUser(req, res, next){
    const user = req.body;
    token = jwt.sign(user, jtwSecret);
    next()
}

app.get("/signin",checkInputs, signinUser, (req, res) => {
    res.json({
        token
    })
})
app.get("/user", checkInputs, (req, res) => {
    const userToken = req.headers.authorization;
    try{
        const user = jwt.verify(userToken, jtwSecret);
    res.json({
        user,
    })
    } catch{
        res.send("invalid token")
    }
})
app.use((err, req, res, next) => {
    console.log(err);
    res.send("some error occured")
})
app.listen(3000)