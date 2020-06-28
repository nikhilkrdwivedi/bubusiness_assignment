import { verify } from 'jsonwebtoken';
export default function(req, res, next) {
    // console.log("req.header",req);
    const token = req.header('access_token');
    console.log("token", token)
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = verify(token, process.env.TOKEN_SECRET);
        req.userCxt = verified.userCxt;
        console.log("req.Cxt: ", req.userCxt)
        return next();
    } catch (error) {
        res.status(400).send('Invalid Token!!');
    }
}