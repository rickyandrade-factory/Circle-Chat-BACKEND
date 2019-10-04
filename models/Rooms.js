var mongoose = require("mongoose");
var User = require("./User");

ROOM_STATUS_PUBLIC = "public";
ROOM_STATUS_PRIVATE = "private";

ROOM_PLAN_USD = "USD";
ROOM_PLAN_EURO = "EUR";

ROOM_ACCESS_ALL = 1;
ROOM_ACCESS_AMI = 2;
ROOM_ACCESS_AMIP = 3;

var RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: [ROOM_STATUS_PUBLIC, ROOM_STATUS_PRIVATE],
    required: true
  },
  post_access: {
    type: Number,
    enum: [ROOM_ACCESS_ALL, ROOM_ACCESS_AMI, ROOM_ACCESS_AMIP],
    required: true
  },
  created_date: {
    type: Date,
    required: true
  },
  is_visible: {
    type: Boolean,
    required: false
  },
  plan: {
    type: String,
    enum: [ROOM_PLAN_USD, ROOM_PLAN_EURO],
    required: false
  },
  coupons: {
    type: Array,
    required: false
  }
});

RoomSchema.statics.createRoom = function(postData, callback) {
  let self = this;
  if (!postData) {
    callback(true, { error: "Missing required paramaeters" });
  } else {
    roomSchema = new Room({
      title: postData.title,
      description: postData.description,
      status: postData.status,
      post_access: (postData.post_access ? postData.post_access : ROOM_ACCESS_ALL),
      created_date: new Date(),
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
              if (roomSchema.status == "public") {
                self.getAllUsers(function(err, results) {
                  if (!err && results.length > 0) {
                    results.map(user => {
                      var userSchema = new require("../models/User")(user);
                      userSchema.rooms.push(roomSchema);
                      userSchema.save();
                    });
                    callback(false, { data: roomSchema });
                  } else {
                    callback(false, { data: roomSchema });
                  }
                });
              }
            } else {
              callback(true, { error: "Error processing your request" });
            }
          }
        }
      });
    }
  }
};

RoomSchema.statics.getAllUsers = function(callback) {
  var User = require("../models/User");
  User.find({}, function(err, results) {
    callback(err, results);
  });
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
