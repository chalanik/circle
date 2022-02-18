const express = require("express");
const User = require("../models/user");
const Circle = require("../models/circle");
const { Post, Comment } = require("../models/post");

// circleRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests
const circleRoutes = express.Router();

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// create a new user.
circleRoutes.route("/api/v1/user/").post(function (req, response) {
  const user = new User(req.body);
  user.save(function (err) {
    if (err) {
      return next(err);
    }
    response.json("");
  });
});

// update user.
circleRoutes.route("/api/v1/user/:id").post(function (req, response) {
  userId = ObjectId(req.params.id);
  let userUpdate = {};
  let queries = [];
  for (const field in req.body) {
    switch (field) {
      case "circles":
        userUpdate["$addToSet"] = { circles: { $each: req.body.circles } };
      case "zip":
        userUpdate["zip"] = req.body.zip;
    }
  }
  console.log(userUpdate);
  Object.keys(userUpdate).length &&
    queries.push(User.findByIdAndUpdate(userId, userUpdate).exec());
  req.body?.circles?.length &&
    queries.push(
      Circle.updateMany(
        { _id: { $in: req.body.circles } },
        {
          $addToSet: { users: userId },
        }
      ).exec()
    );
  Promise.all(queries)
    .then((res) => {
      console.log(res);
      response.json("");
    })
    .catch((err) => {
      response.sendStatus(503);
    });
});

// create a new circle.
circleRoutes.route("/api/v1/circle/").post(function (req, response) {
  const circle = new Circle(req.body);
  circle.save(function (err) {
    if (err) {
      return next(err);
    }
    response.json("");
  });
});

// create a new post
circleRoutes.route("/api/v1/circle/:id/post/").post(function (req, response) {
  const post = new Post(req.body);
  post.circle = ObjectId(req.params.id);
  post.save(function (err) {
    if (err) {
      return next(err);
    }
    Circle.findByIdAndUpdate(post.circle, {
      $addToSet: { posts: post._id },
    })
      .then((res) => response.json(res))
      .catch((err) => response.sendStatus(503));
  });
});

// add a comment
circleRoutes.route("/api/v1/post/:id/comment").post(function (req, response) {
  const comment = new Comment(req.body);
  comment.save((err) => {
    if (err) return next(err);

    Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { comments: comment._id },
    })
      .then((res) => {
        response.json(res);
      })
      .catch((err) => {
        console.error(err);
        response.sendStatus(503);
      });
  });
});

//get user details
circleRoutes.route("/api/v1/user/:id").get(function (req, response) {
  User.findById(req.params.id)
    .populate({
      path: "circles",
      populate: { path: "posts" },
    })
    .exec(function (err, user) {
      if (err) return handleError(err);
      response.json(user);
    });
});

//get circle details
circleRoutes.route("/api/v1/circle/:id").get(function (req, response) {
  Circle.findById(req.params.id)
    .populate({
      path: "users", field: "name"
    })
    .populate({
      path: "posts"
    })
    .exec(function (err, user) {
      if (err) return handleError(err);
      response.json(user);
    });
});

//get post details
circleRoutes.route("/api/v1/post/:id").get(function (req, response) {
  Post.findById(req.params.id)
    .populate({
      path: "comments",
      populate: { path: "user", select: "name" },
    })
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "circle",
      select: "name",
    })
    .exec(function (err, user) {
      if (err) return handleError(err);
      response.json(user);
    });
});

//get all circles
circleRoutes.route("/api/v1/circles").get(function (req, response) {
  Circle.find({}).exec(function (err, user) {
    if (err) return handleError(err);
    response.json(user);
  });
});

module.exports = circleRoutes;
