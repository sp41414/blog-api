const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");

authRouter.get("/status", authController.status);
authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);

module.exports = authRouter;
