require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routers = {
    authRouter: require("./src/routes/authRoutes"),
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    }),
);
app.use("/auth", routers.authRouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: {
            message: err.message,
            timestamp: new Date().toISOString(),
        },
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App listening on PORT ${PORT}`);
});
