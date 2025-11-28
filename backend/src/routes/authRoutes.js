const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");

authController.get("/status", authController.status);
authController.get("/login", authController.login);
authController.get("/signup", authController.signup);

module.exports = authRouter;
