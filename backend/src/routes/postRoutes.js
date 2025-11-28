const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController");

// get all posts
postRouter.get("/posts", postController.posts);
// get post by id
postRouter.get("/posts/:id", postController.postById);
// get post comments by id
postRouter.get("/posts/:id/comments", postController.postCommentsById);
// PROTECTED ROUTES
// create new comment
postRouter.post("/posts/:id/comments", postController.newComment);
// create new post
postRouter.post("/posts", postController.newPost);
// edit post
postRouter.put("/posts/:id", postController.updatePost);
// edit comment
postRouter.put("/posts/:id/comments/:commentId", postController.updateComment);
// delete post
postRouter.delete("/posts/:id", postController.deletePost);
// delete comment
postRouter.delete(
    "/posts/:id/comments/:commentId",
    postController.deleteComment,
);

module.exports = postRouter;
