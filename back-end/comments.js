const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


const users = require("./users.js");
const User = users.model;
const validUser = users.valid;
const photos = require("./photos.js");
const Photo = photos.model;


const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  content: String,
  created: {
    type: Date,
    default: Date.now
  },
});
const Comment = mongoose.model('Comment', commentSchema);


// Endpoints:

router.post('/', validUser, async(req, res) => {
  //validating post
  if (!req.body.photo || !req.body.content) {
    return res.status(400).send({
      message: "Mising user, photo, or comment"
    })
  }
  if (!req.body.content===""){
    return res.status(400).send({
      message: "Comment must contain something"
    })
  }
  const comment = new Comment({
    user: req.user,
    photo: req.body.photo,
    content: req.body.content,
  })
  try {
    await comment.save();
    return res.send({comment: comment});
  } catch(error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//Get all comments associated with the given picture.
router.get('/:id', async(req, res) => {
  try {
    let comments = await Comment.find({
      photo: req.params.id
    }).sort({created: -1}).populate('user');
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Comment,
  routes: router,
}
