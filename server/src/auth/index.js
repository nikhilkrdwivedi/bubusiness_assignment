// const router =  require('express').Router();
import express from 'express';
var router = express.Router();
import User from './user.model';
import { registerValidation, loginValidation } from './validation';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

router.post('/register', async(req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const existUser = await User.findOne({ $or: [{ email: req.body.email }, { contact: req.body.contact }] });
    if (existUser) return res.status(400).send("Bad Request!!!");
    //hash password
    const salt = await genSalt(10);
    const hashPassword = await hash(req.body.password, salt);
    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        password: hashPassword
    });
    try {
        //Lets validate the data before make a call ussr
        const saveUser = await user.save();
        res.send(saveUser);
    } catch (err) {
        res.status(400).send(err);
    }
});
router.post('/login', async(req, res) => {
    console.log("req: ", req.body)
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ contact: req.body.contact });
    if (!user) return res.status(400).send("Bad Request!!!");
    //if password is correct 
    const validPass = await compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("invalid password");

    //create and assign a token
    let tempUserCxt = {
        name: user.name,
        _id: user._id,
        email: user.email,
        contact: user.contact,
        date: user.date
    }
    console.log(tempUserCxt)
    const token = sign({ userCxt: tempUserCxt }, process.env.TOKEN_SECRET, { expiresIn: '24h' })
    let tempRes = {
        'access_token': token,
        userCxt: tempUserCxt
    }
    console.log("token: ", token)
    res.header('access_token', token).json(tempRes);
});
export default router;