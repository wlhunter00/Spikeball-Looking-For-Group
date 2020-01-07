const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 500,
    min: 1
  },
  creator: {
    type: String,
    required: true,
    max: 255,
    min: 1
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateEvent: {
    type: Date,
    min: Date.now,
    required: true
  },
  expired: {
    type: Boolean,
    default: false
  },
  filled: {
    type: Boolean,
    default: false
  },
  peopleAttending: {
    type: Number,
    default: 0,
    max: 4,
    min: 0,
    required: true
  },
  location: {
    type: String,
    required: true,
    min: 1,
    max: 600
  },
  usersJoined: [{ username: String, partySize: Number }]
});

module.exports = mongoose.model("Posts", postSchema);
