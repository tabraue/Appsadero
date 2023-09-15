
const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const signUp = async (req, res) => {
    try {           
        const checkUser = await User.findOne({where: {email: req.body.email}}) 

        console.log(checkUser)
        if(checkUser) return res.status(400).send("Email already exists.")
        
        const nick = await User.findOne({where: {nickname: req.body.nickname}})
        console.log(nick)
        if(nick) return res.status(400).send("Nickname not available")  

        req.body.password = bcrypt.hashSync(req.body.password, 10);

        const user = await User.create(req.body)
        //REMEMBER CHANGE EXPIRATES SESSION 
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '1y'})

        delete user.password;

        console.log("Sign up successfully");

        return res.status(200).json({ message: "Sign up successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send(">> Oops something went wrong, we could not sign you up.")
    }
}

const logIn = async(req, res) => {
    try{
        const user = await User.findOne({where: {email: req.body.email} })
        const userDetails = {
            token: '',
            first_name: '',
            nickname: '',
        }
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(result){
                    //REMEMBER CHANGE EXPIRATES SESSION 
                    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '1y'})
                    userDetails.token = token
                    userDetails.first_name = user.first_name  
                    userDetails.nickname = user.nickname    
                    return res.status(200).json({userDetails});
                }
                return res.status(400).send(">> Oops something went wrong, user or password incorrect.")
            })
        }/* else{
            return res.status(401).send(">> Oops something went wrong, user or password incorrect.")
        } */
    }catch(error) {
        return res.status(402).send(">> Oops something went wrong, user or password incorrect.")
    }
}



module.exports = { signUp, logIn }