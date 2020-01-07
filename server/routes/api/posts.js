const express = require("express");
const router = express.Router();
const Post = require("./../../models/Post.js");
const verify = require("./verifyToken.js");

async function handleExpired(post) {
  try {
    const updatedPost = await Post.updateOne(
      { _id: post._id },
      {
        $set: {
          expired: true
        }
      }
    );
    console.log("expired post updated");
  } catch (err) {
    console.log("error:", err);
  }
}
async function handleFilled(post) {
  try {
    const updatedPost = await Post.updateOne(
      { _id: post._id },
      {
        $set: {
          filled: true
        }
      }
    );
    console.log("filled post updated");
  } catch (err) {
    console.log("error:", err);
  }
}
async function handleUnfilled(post) {
  console.log("handling a filled post that needs to be unfilled");
  try {
    const updatedPost = await Post.updateOne(
      { _id: post._id },
      {
        $set: {
          filled: false
        }
      }
    );
    console.log("unfilled post updated");
  } catch (err) {
    console.log("error:", err);
  }
}

async function handleEmpty(post) {
  await Post.deleteOne({ _id: post._id });
}

function checkExpired(posts) {
  var newPosts = [];
  posts.forEach(function(post, index, object) {
    var today = new Date();
    var date2 = new Date(post.dateEvent);
    if (date2 < today) {
      console.log("expired post found");
      handleExpired(post);
    } else {
      newPosts.push(post);
    }
  });
  return newPosts;
}

function checkEmpty(posts) {
  var newPosts = [];
  posts.forEach(function(post, index, object) {
    if (post.peopleAttending <= 0) {
      console.log("empty post found");
      handleEmpty(post);
    } else {
      newPosts.push(post);
    }
  });
  return newPosts;
}

function checkFilled(posts) {
  var newPosts = [];
  posts.forEach(function(post, index, object) {
    if (post.filled && post.peopleAttending < 4) {
      handleUnfilled(post);
      newPosts.push(post);
    } else if (!post.filled && post.peopleAttending === 4) {
      handleFilled(post);
    } else if (!post.filled) {
      newPosts.push(post);
    }
  });
  return newPosts;
}

function custom_sort(a, b) {
  return new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime();
}

// Get all  the posts
router.get("/", async (req, res) => {
  try {
    var posts = await Post.find({ expired: false });
    posts = checkExpired(posts);
    posts = checkFilled(posts);
    posts = checkEmpty(posts);
    posts = posts.sort(custom_sort);
    res.json(posts);
  } catch (err) {
    res.send(err);
  }
});
// Get specific post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.filled && post.peopleAttending < 4) {
      handleUnfilled(post);
    } else if (!post.filled && post.peopleAttending === 4) {
      handleFilled(post);
    }
    var today = new Date();
    var date2 = new Date(post.dateEvent);
    if (date2 < today) {
      console.log("expired post found");
      handleExpired(post);
    }
    res.json(post);
  } catch (err) {
    res.send(err);
  }
});
// Add post
router.post("/", verify, async (req, res) => {
  console.log("recieved:");
  var dateEvent = new Date(req.body.dateEvent);
  const post = new Post({
    title: req.body.title,
    creator: req.user.username,
    dateEvent: dateEvent,
    peopleAttending: req.body.peopleAttending,
    location: req.body.location,
    usersJoined: {
      username: req.user.username,
      partySize: req.body.peopleAttending
    }
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.send(err);
  }
});

// Delete posts
router.delete("/", verify, async (req, res) => {
  try {
    const removedPost = await Post.deleteOne({ _id: req.body.postId });
    res.json(removedPost);
  } catch (err) {
    res.send(err);
  }
});

// UPDATE FUNCTIONS

// Update whole post
router.patch("/wholePost/", verify, async (req, res) => {
  var today = new Date();
  var date2 = new Date(req.body.dateEvent);
  var failed = false;
  if (date2 < today) {
    res.send({ type: "Error", message: "New date too early" });
    failed = true;
  }
  if (!failed) {
    try {
      const updatedPost = await Post.updateOne(
        { _id: req.body.postId },
        {
          $set: {
            title: req.body.title,
            dateEvent: req.body.dateEvent,
            location: req.body.location
          }
        },
        function(error, success) {
          if (error) {
            console.log("Query error:", error);
          }
        }
      );
      console.log("Sucessfully Updated");
      res.json(updatedPost);
    } catch (err) {
      console.log("error:", err);
      res.send(err);
    }
  }
});

// Update post's title
router.patch("/title/", async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.body.postId },
      {
        $set: {
          title: req.body.title
        }
      }
    );
    res.json(updatedPost);
  } catch (err) {
    res.send(err);
  }
});
// Update post's event date
router.patch("/dateEvent/", async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.body.postId },
      {
        $set: {
          dateEvent: req.body.dateEvent
        }
      }
    );
    res.json(updatedPost);
  } catch (err) {
    res.send(err);
  }
});
// Update post's People Attending
router.patch("/peopleAttending/", verify, async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.body.postId },
      {
        $set: {
          peopleAttending: req.body.peopleAttending
        },
        $push: {
          usersJoined: {
            username: req.user.username,
            partySize: req.body.partySize
          }
        }
      }
    );
    res.json(updatedPost);
  } catch (err) {
    res.send(err);
  }
});

// Have User Leave Group
router.patch("/leaveGroup/", verify, async (req, res) => {
  var match = false;
  try {
    const ogPost = await Post.findById(req.body.postId);
    for (var i = 0; i < ogPost.usersJoined.length; i++) {
      if (ogPost.usersJoined[i].username === req.user.username) {
        console.log("users match", ogPost.usersJoined[i]);
        const userLeaving = ogPost.usersJoined[i];
        var newTotal =
          parseInt(ogPost.peopleAttending) - parseInt(userLeaving.partySize);
        console.log("new total", newTotal);
        match = true;
        break;
      }
    }
    if (match === false) {
      res.send({ type: "Error", message: "This user is not in the group" });
    }
  } catch (err) {
    console.log(err);
  }
  if (match) {
    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.body.postId },
        {
          $set: {
            peopleAttending: newTotal
          },
          $pull: {
            usersJoined: {
              username: req.user.username
            }
          }
        }
      );
      res.json(updatedPost);
    } catch (err) {
      res.send(err);
    }
  }
});

// Have Reduce user party
router.patch("/changePartySize/", verify, async (req, res) => {
  var match = false;
  var overflow = false;
  var ogPost;
  var newTotal;
  try {
    ogPost = await Post.findById(req.body.postId);
    for (var i = 0; i < ogPost.usersJoined.length; i++) {
      if (ogPost.usersJoined[i].username === req.body.username) {
        console.log("users match", ogPost.usersJoined[i]);
        var newTotal =
          parseInt(ogPost.peopleAttending) -
          parseInt(ogPost.usersJoined[i].partySize) +
          parseInt(req.body.partySize);

        if (newTotal > 4) {
          overflow = true;
        }
        ogPost.usersJoined[i].partySize = req.body.partySize;
        match = true;
        break;
      }
    }
    if (match === false) {
      console.log("This user is not in the group");
      res.send({ type: "Error", message: "This user is not in the group" });
    }
    if (overflow) {
      console.log("this party size was too big");
      res.send({ type: "Error", message: "this party size is too big" });
    }
  } catch (err) {
    console.log(err);
  }
  if (match && !overflow) {
    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.body.postId },
        {
          $set: {
            peopleAttending: newTotal,
            usersJoined: ogPost.usersJoined
          }
        }
      );
      console.log(updatedPost);
      res.json(updatedPost);
    } catch (err) {
      res.send(err);
    }
  }
});

module.exports = router;
