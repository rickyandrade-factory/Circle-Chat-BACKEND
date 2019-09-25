var mongoose = require("mongoose");
var fs = require("fs");

ROOM_STATUS_PUBLIC = "public";
ROOM_STATUS_PRIVATE = "private";

var RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: [ROOM_STATUS_PUBLIC, ROOM_STATUS_PRIVATE],
    required: true
  }
});

RoomSchema.statics.createRoom = function(postData, callback) {
  if (!postData) {
    callback(true, { error: "Missing required paramaeters" });
  } else {
    roomSchema = new Room({
      title: postData.title,
      status: postData.status,
      created_date: new Date()
    });
    var error = roomSchema.validateSync();
    // valildations failed
    if (error) {
      callback(true, {
        error: error.errors[Object.keys(error.errors)[0]].message
      });
    } else {
      this.find({ title: postData.title }, function(err, results) {
        // error checking duplicate room
        if (err) {
          callback(true, {
            error: "Problem fetching data. Please try again later"
          });
        } else {
          // found duplicate room name
          if (results.length > 0) {
            callback(true, {
              error: "Another room with same name already exists"
            });
          } else {
            if (roomSchema.save()) {
              callback(false, { data: roomSchema });
            } else {
              callback(true, { error: "Error processing your request" });
            }
          }
        }
      });
    }
  }
};

RoomSchema.statics.validate = function(post) {
  if (!post.hasOwnProperty("title") || !post.title) {
    return false;
  }
  if (!post.hasOwnProperty("status") || !post.status) {
    return false;
  }
  return true;
};

var Room = mongoose.model("room", RoomSchema);
module.exports = Room;
