import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import cors from 'cors';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';

require('dotenv').config();

let app = express();
app.use(cors({ 
    origin: true, 
    credentials: true,
}));

app.use(function (req, res, next) {
    //we will config header for request and response
    res.header("Access-Control-Allow-Origin", process.env.URL_REACT);

    // Request methods you wish to allow
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    res.header("Access-Control-Allow-Credentials", true);
    next();
}
);

//config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969;
//PORT === undefined => port = 6969
app.listen(port, () => {
    //callback
    console.log(`Server nodejs is running on port: ${port}`);
});