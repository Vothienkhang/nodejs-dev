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