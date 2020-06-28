//Package Imports Goes Here
import express from 'express';
import User from './user.model';
import { registerValidation, loginValidation } from './validation';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { uuid } from 'uuidv4';
var router = express.Router();

//Register New User
router.post('/register', async(req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const existUser = await User.findOne({ $or: [{ email: req.body.email }, { contact: req.body.contact }] });
    if (existUser) {
        return res.status(400).send("Bad Request.");
    }

    //hash password
    const salt = await genSalt(10);
    const hashPassword = await hash(req.body.password, salt);

    //create a new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contact: req.body.contact,
        password: hashPassword,
        cardNumber: uuid()
    });
    try {
        //Lets validate the data before make a call ussr
        const saveUser = await user.save();
        res.status(200).send(saveUser);

    } catch (err) {
        res.status(400).send(err);
    }
});

//Login User
router.post('/login', async(req, res) => {

    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //If User is not exists
    const user = await User.findOne({ contact: req.body.contact });
    if (!user) {
        return res.status(400).send("Bad Request.");
    }

    //if password is correct 
    const validPass = await compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send("invalid password");
    }

    //create context and assign a token
    let tempUserCxt = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        cardNumber: user.cardNumber,
        date: user.date,
    }
    const token = sign({ userCxt: tempUserCxt }, process.env.TOKEN_SECRET, { expiresIn: '24h' })
    let tempRes = {
        'access_token': token,
        userCxt: tempUserCxt
    }
    res.header('access_token', token).json(tempRes);
});

export default router;