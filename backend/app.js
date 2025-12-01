require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("./src/auth/passport");
const routers = {
    authRouter: require("./src/routes/authRoutes"),
    postRouter: require("./src/routes/postRoutes"),
};
const limit = require("express-rate-limit");

// brute force protection
const limiter = limit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 100, // 100 requests every 1 minute
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: (origin, cb) => {
            // allows no origin requests
            if (!origin) return cb(null, true);

            const allowedDomain = process.env.FRONTEND_URL;
            // dynamic domains like the one im hosting on (cloudflare pages)
            if (
                origin === process.env.FRONTEND_URL ||
                origin.endsWith(allowedDomain)
            ) {
                return cb(null, true);
            } else {
                return cb(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);
app.use(limiter);
app.use(passport.initialize());
app.use("/auth", routers.authRouter);
app.use("/posts", routers.postRouter);
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
