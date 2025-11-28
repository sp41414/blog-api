const passport = require("passport");
const db = require("../db/prisma");

const posts = async (req, res, next) => {
    try {
        const posts = await db.posts.findMany({
            where: {
                published: true,
            },
        });
        if (posts.length === 0) {
            return res.status(404).json({
                error: {
                    message: "Posts not found",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        res.json({
            posts: posts,
            message: "Retrieved posts successfully",
        });
    } catch (err) {
        next(err);
    }
};

const postById = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({
            error: {
                message: "Provide a post ID",
                timestamp: new Date().toISOString(),
            },
        });
    }
    try {
        const post = await db.posts.findFirst({
            where: {
                published: true,
                id: Number(req.params.id),
            },
        });
        if (!post) {
            return res.status(404).json({
                error: {
                    message: "No posts found with this ID",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        res.json({
            post: post,
            message: "Retrieved post successfully",
        });
    } catch (err) {
        next(err);
    }
};

const drafts = [
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
        if (!req.user.admin) {
            return res.status(403).json({
                error: {
                    message: "Cannot access post drafts, must be admin user",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        try {
            const posts = await db.posts.findMany({
                where: {
                    published: false,
                },
            });
            if (!posts) {
                return res.status(404).json({
                    error: {
                        message: "No draft posts found",
                        timestamp: new Date().toISOString(),
                    },
                });
            }
            res.json({
                posts: posts,
                message: "Successfully retrieved drafts",
            });
        } catch (err) {
            next(err);
        }
    },
];

const draftById = [
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
        if (!req.user.admin) {
            return res.status(403).json({
                error: {
                    message: "Cannot access post drafts, must be admin user",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        if (!req.params.id) {
            return res.status(400).json({
                error: {
                    message: "Provide a draft post ID",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        try {
            const post = await db.posts.findFirst({
                where: {
                    published: false,
                    id: Number(req.params.id),
                },
            });
            if (!post) {
                return res.status(404).json({
                    error: {
                        message: "No draft post with this ID found",
                        timestamp: new Date().toISOString(),
                    },
                });
            }
            res.json({
                post: post,
                message: "Retrieved draft post successfully",
            });
        } catch (err) {
            next(err);
        }
    },
];

const postCommentsById = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({
            error: {
                message: "Provide a post ID",
                timestamp: new Date().toISOString(),
            },
        });
    }
    try {
        const comments = await db.comments.findMany({
            where: {
                postsId: Number(req.params.id),
            },
        });
        if (!comments) {
            return res.status(404).json({
                error: {
                    message: "No post comments found",
                    timestamp: new Date().toISOString(),
                },
            });
        }
        res.json({
            comments: comments,
            message: "Retrieved comments successfully",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    posts,
    postById,
    drafts,
    draftById,
    postCommentsById,
    newComment,
    newPost,
    updatePost,
    updateComment,
    deletePost,
    deleteComment,
};
