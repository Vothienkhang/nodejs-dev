import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/khangit', (req, res) => {
        return res.send("Hello World")
    });

    return app.use("/", router);
}

module.exports = initWWebRoutes