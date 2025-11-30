const passport = require("passport");
const db = require("../db/prisma");
const { matchedData, validationResult, body } = require("express-validator");

const validateComment = [
  body("text")
    .exists()
    .withMessage("Comment text is required.")
    .isString()
    .withMessage("Comment text must be a string.")
    .isLength({ min: 1, max: 200 })
    .withMessage("Comment must be between 1 and 200 characters long")
    .trim()
    .escape(),
];

const validatePost = [
  body("title")
    .exists()
    .withMessage("Post title is required.")
    .isString()
    .withMessage("Title must be a string.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters long")
    .escape(),
  body("text")
    .exists()
    .withMessage("Post text is required.")
    .isString()
    .withMessage("Text must be a string.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text cannot be empty")
    .escape(),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
];

// for optional fields (different)
const validatePostUpdate = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters long")
    .escape(),
  body("text")
    .optional()
    .isString()
    .withMessage("Text must be a string.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text cannot be empty")
    .escape(),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
];

const posts = async (req, res, next) => {
  try {
    const posts = await db.posts.findMany({
      where: {
        published: true,
      },
    });
    if (posts.length === 0) {
      return res.status(200).json({
        posts: [],
        message: "Posts not found",
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

const draft = [
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
      if (posts.length === 0) {
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
    const post = await db.posts.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!post) {
      return res.status(404).json({
        error: {
          message: "Post not found",
          timestamp: new Date().toISOString(),
        },
      });
    }
    const comments = await db.comments.findMany({
      where: {
        postsId: Number(req.params.id),
      },
    });
    if (comments.length === 0) {
      return res.status(200).json({
        comments: [],
        message: "No post comments found",
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

const newComment = [
  passport.authenticate("jwt", { session: false }),
  validateComment,
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
    if (!req.params.id) {
      return res.status(400).json({
        error: {
          message: "Please provide a valid post ID",
          timestamp: new Date().toISOString(),
        },
      });
    }
    const { text } = matchedData(req);
    try {
      const post = await db.posts.findFirst({
        where: {
          id: Number(req.params.id),
          published: true,
        },
      });
      if (!post) {
        return res.status(404).json({
          error: {
            message: "Post not found",
            timestamp: new Date().toISOString(),
          },
        });
      }
      const comment = await db.comments.create({
        data: {
          text: text,
          usersId: req.user.id,
          postsId: Number(req.params.id),
          author: req.user.username,
        },
      });
      res.json({
        comment: comment,
        message: "Created comment successfully",
      });
    } catch (err) {
      next(err);
    }
  },
];

const newPost = [
  passport.authenticate("jwt", { session: false }),
  validatePost,
  async (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errs.array(),
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (!req.user.admin) {
      return res.status(403).json({
        error: {
          message: "Cannot create new post, must be an admin user",
          timestamp: new Date().toISOString(),
        },
      });
    }
    try {
      const { title, text, published } = matchedData(req);
      const post = await db.posts.create({
        data: {
          title: title,
          text: text,
          usersId: req.user.id,
          author: req.user.username,
          published: published,
        },
      });
      return res.json({
        post: post,
        message: "Post created successfully",
      });
    } catch (err) {
      next(err);
    }
  },
];

const updatePost = [
  passport.authenticate("jwt", { session: false }),
  validatePostUpdate,
  async (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errs.array(),
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (!req.user.admin) {
      return res.status(403).json({
        error: {
          message: "Cannot edit post, must be an admin user",
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (!req.params.id) {
      return res.status(400).json({
        error: {
          message: "No post ID inputted",
          timestamp: new Date().toISOString(),
        },
      });
    }
    try {
      const { title, text, published } = matchedData(req);
      const postId = Number(req.params.id);

      const updatedPost = await db.posts.update({
        where: {
          id: postId,
        },
        data: {
          title: title,
          text: text,
          published: published,
        },
      });

      return res.json({
        updatedPost: updatedPost,
        message: "Post updated successfully",
      });
    } catch (err) {
      next(err);
    }
  },
];

const updateComment = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.params.id) {
      return res.status(400).json({
        error: {
          message: "Specify post ID",
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (!req.params.commentId) {
      return res.status(400).json({
        error: {
          message: "Specify comment ID",
          timestamp: new Date().toISOString(),
        },
      });
    }
    try {
      const postId = Number(req.params.id);
      const commentId = Number(req.params.commentId);

      const { text } = req.body;

      const comment = await db.comments.update({
        where: {
          id: commentId,
          postsId: postId,
          usersId: req.user.id,
        },
        data: {
          text: text ?? undefined,
        },
      });
      return res.json({
        comment: comment,
        message: "Comment updated successfully",
      });
    } catch (err) {
      next(err);
    }
  },
];

const deletePost = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.user.admin) {
      return res.status(403).json({
        error: {
          message: "Cannot delete posts must be admin user",
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (!req.params.id) {
      return res.status(400).json({
        error: {
          message: "Provide a post to delete by ID",
          timestamp: new Date().toISOString(),
        },
      });
    }
    try {
      const postId = Number(req.params.id);
      const post = await db.posts.delete({
        where: {
          id: postId,
        },
      });
      return res.json({
        post: post,
        message: "Post deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
];

const deleteComment = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.params.id) {
      return res.status(400).json({
        error: {
          message: "Provide a post to delete a comment in",
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (!req.params.commentId) {
      return res.status(400).json({
        error: {
          message: "Provide a comment to delete",
          timestamp: new Date().toISOString(),
        },
      });
    }
    try {
      const postId = Number(req.params.id);
      const commentId = Number(req.params.commentId);
      const comment = await db.comments.delete({
        where: {
          id: commentId,
          usersId: req.user.id,
          postsId: postId,
        },
      });
      return res.json({
        comment: comment,
        message: "Comment deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
];

module.exports = {
  posts,
  postById,
  draft,
  draftById,
  postCommentsById,
  newComment,
  newPost,
  updatePost,
  updateComment,
  deletePost,
  deleteComment,
};
