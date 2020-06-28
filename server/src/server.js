//All Package Imports goes here
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
var cors = require('cors')
var morgan = require('morgan')

//express server 
const app = express();

//middleware
app.use(express.json())
app.use(cors());
app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: true, limit: '32mb' }));
app.use(bodyParser.json({ limit: '32mb' }));

//DB connection and env variable
const port = process.env.PORT || 3000;

//DB Connection
try {
    mongoose.connect(
        process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
} catch (error) {
    console.log("Database is not connected, Please check value of connection")
}

//check db connection and error status
mongoose.connection.on('connected', function() {
    console.log(`Mongoose default connection is open to '${process.env.DB_CONNECT}'`);
});
mongoose.connection.on('error', function(err) {
    console.log("Mongoose default connection has occured " + err + " error");
});
mongoose.connection.on('disconnected', function() {
    console.log("Mongoose default connection is disconnected");
});
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0);
    });
});

//Import Route
import authRoute from './auth';
const auth = require('./auth/verifyToken').default;
app.use('/auth', authRoute)
app.use('/api', auth, require('./api'))

//Default Route
app.get('/', (req, res) => res.status(200).json({
    "status": 200,
    "message": "Welcome to BUBusiness.",
    "data": []
}))

//Not Found Route
app.get(/^\/(.*)/, (req, res) => res.status(404).json({
    "status": 404,
    "message": "Unexpected route is hitting.",
    "data": []
}))
if (process.env.production === 'true') {
    console.log('')
    app.listen(port, async() => {
        console.log(`server is running on production on port  ${port} !`);
    })
}