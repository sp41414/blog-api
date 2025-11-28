const db = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { matchedData, validationResult, body } = require("express-validator");
const SECRET = process.env.SECRET;

const validateUser = [
    body("username")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage(`Username must be between 1 and 20 characters long`)
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage(`Username must only have characters numbers and spaces`),
    body("password")
        .trim()
        .isLength({ min: 6, max: 32 })
        .withMessage(`Password must be between 6 and 32 characters long`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\s\S]{6,32}$/)
        .withMessage(
            `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&*).`,
        ),
];

const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        user = await db.users.findFirst({
            where: {
                username: username,
            },
        });
        if (!user) {
            return res.status(401).json({
                error: {
                    message: "Invalid username or password",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
            const token = jwt.sign({ id: user.id }, SECRET, {
                expiresIn: "2d",
            });
            res.json({
                token,
                details: "User logged in successfully",
            });
        } else {
            return res.status(401).json({
                error: {
                    message: "Invalid username or password",
                    timestamp: new Date().toISOString(),
                },
            });
        }
    } catch (err) {
        next(err);
    }
};

const signup = [
    validateUser,
    async (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({
                error: {
                    message: err.array(),
                    timestamp: new Date().toISOString(),
                },
            });
        }
        const { username, password } = matchedData(req);
        try {
            const user = await db.users.findFirst({
                where: {
                    username: username,
                },
            });
            if (user) {
                return res.status(409).json({
                    error: {
                        message: "User already exists",
                        timestamp: new Date().toISOString(),
                    },
                });
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const createdUser = await db.users.create({
                data: {
                    username: username,
                    passwordHash: hashedPassword,
                },
            });
            res.status(201).json({
                user: createdUser,
                details: "User created successfully",
            });
        } catch (err) {
            next(err);
        }
    },
];

const status = (req, res) => {
    if (req.user) {
        return res.json({
            message: "Login authentication successful",
            user: req.user,
        });
    }
    res.status(401).json({
        error: {
            message: "Login authentication failed",
            timestamp: new Date().toISOString(),
        },
    });
};

module.exports = {
    login,
    signup,
    status,
};
