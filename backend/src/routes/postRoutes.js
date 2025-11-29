const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController");
const limit = require("express-rate-limit");

const commentLimiter = limit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 3, // 3 comments every 5 minutes
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});

// get all posts
postRouter.get("/", postController.posts);
// get all non-published posts
postRouter.get("/drafts", postController.draft);
// get non-published posts by ID
postRouter.get("/drafts/:id", postController.draftById);
// get post by id
postRouter.get("/:id", postController.postById);
// get post comments by id
postRouter.get("/:id/comments", postController.postCommentsById);
// create new comment
postRouter.post("/:id/comments", commentLimiter, postController.newComment);
// create new post
postRouter.post("/", postController.newPost);
// edit post
postRouter.put("/:id", postController.updatePost);
// edit comment
postRouter.put("/:id/comments/:commentId", postController.updateComment);
// delete post
postRouter.delete("/:id", postController.deletePost);
// delete comment
postRouter.delete("/:id/comments/:commentId", postController.deleteComment);

module.exports = postRouter;
