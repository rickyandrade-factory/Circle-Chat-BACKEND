var mongoose = require("mongoose");
var fs = require("fs");
var Room = require("./Rooms");
var jsonFile = JSON.parse(fs.readFileSync("connections.json", "utf8"));
var allRooms = JSON.parse(fs.readFileSync("allRooms.json", "utf8"));

USER_STATUS_VERIFIED = 1;
USER_STATUS_UNVERIFIED = 0;

var ContactsSchema = new mongoose.Schema({
  name: String,
  country_code: Number,
  device_token: String,
  number: String,
  status: String,
  on_app: Boolean
});

var UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [USER_STATUS_VERIFIED, USER_STATUS_UNVERIFIED],
    required: true
  },
  rooms: {
    type: Array,
    required: false
  },
  country_code: {
    type: Number,
    required: false
  },
  device_token: {
    type: String,
    required: false
  },
  number: {
    type: Number,
    required: false
  },
  contacts: {
    type: [ContactsSchema],
    required: false
  },
  profile_pic: {
    type: String,
    required: false
  }
});

UserSchema.statics.getRooms = function(username, callback) {
  if (jsonFile.hasOwnProperty(username)) {
    callback({ success: 1, data: jsonFile[username].userData.rooms });
  } else {
    callback({ error: 1, message: "Invalid user!" });
  }
};

UserSchema.statics.loadRooms = function(userId, callback) {
  this.findById(userId, function(err, result) {
    if (!err) {
      if (result.hasOwnProperty("rooms")) {
        callback(false, { rooms: result.rooms });
      } else {
        callback(false, { rooms: [] });
      }
    } else {
      callback(true, { rooms: [] });
    }
  });
};

UserSchema.statics.login = function(post, callback) {
  if (!post.hasOwnProperty("password") || !post.password) {
    callback(true, { error: "Password is required" });
    return false;
  }

  if (!post.hasOwnProperty("email") || !post.email) {
    callback(true, { error: "Email is required" });
    return false;
  }
  this.findOne({ email: post.email, password: post.password }, function(
    err,
    result
  ) {
    if (err) {
      callback(true, { error: "Error processing your request" });
    } else {
      if (!result) {
        callback(true, {
          error: "User not found. Please check email and password"
        });
      } else {
        callback(false, { data: result });
      }
    }
  });
};

UserSchema.statics.getJsonLogin = function(post, callback) {
  if (jsonFile.hasOwnProperty(post.username)) {
    if (
      jsonFile[post.username] &&
      jsonFile[post.username].pwd == post.password
    ) {
      callback({
        success: 1,
        data: jsonFile[post.username].userData,
        rooms: allRooms
      });
    } else {
      callback({ error: 1, message: "Incorrect Password !" });
    }
  } else {
    callback({ error: 1, message: "User does not exist." });
  }
};

UserSchema.statics.register = function(post, callback) {
  if (post) {
    userSchema = new User(post);
    var error = userSchema.validateSync();
    if (error) {
      callback(true, {
        error: error.errors[Object.keys(error.errors)[0]].message
      });
    } else {
      this.find({ email: post.email }, function(err, results) {
        if (results.length > 0) {
          callback(true, { error: "User Email already registered" });
        } else {
          Room.find({ status: ROOM_STATUS_PUBLIC }, function(err, results) {
            if (err) {
              userSchema.save();
              callback(false, { data: userSchema });
            } else {
              if (results.length > 0) {
                // found pulic rooms to join
                results.map(elem => {
                  userSchema.rooms.push(elem);
                });
                userSchema.save();
                callback(false, { data: userSchema });
              } else {
                userSchema.save();
                callback(false, { data: userSchema });
              }
            }
          });
        }
      });
    }
  } else {
    callback(true, { error: "Missing required parameters" });
  }
};

var User = mongoose.model("user", UserSchema);
module.exports = User;
