var mongoose = require("mongoose");
var User = require("./User");

STATUS_DELIVERED = 1;
STATUS_NOT_DELIVERED = 0;
MESSAGE_TYPE_TEXT = 1;
MESSAGE_TYPE_IMAGE = 2;
MESSAGE_TYPE_LOCATION = 3;
MESSAGE_TYPE_VOICE = 4;
MESSAGE_TYPE_VIDEO = 5;
MESSAGE_TYPE_OTHER = 6;

var RoomMessagesSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.ObjectId, ref: "rooms", required: true },
  senderId: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  type: {
    type: Number,
    enum: [
      MESSAGE_TYPE_TEXT,
      MESSAGE_TYPE_IMAGE,
      MESSAGE_TYPE_LOCATION,
      MESSAGE_TYPE_VOICE,
      MESSAGE_TYPE_VIDEO,
      MESSAGE_TYPE_OTHER
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [STATUS_DELIVERED, STATUS_NOT_DELIVERED],
    required: true
  },
  doc_id: {
    type: String,
    required: false
  },
  created_date: {
    type: Date,
    required: true
  }
});

RoomMessagesSchema.statics.getHistory = function(data, callback) {
  console.log(`mongoose id is: ${data.roomId}`);
  console.log(data.roomId);
  this.aggregate([
    {
      $lookup: {
        localField: "senderId",
        from: "users",
        foreignField: "_id",
        as: "userinfo"
      }
    },
    { $unwind: "$userinfo" },
    {
      $project: {
        roomId: 1,
        message: 1,
        created_date: 1,
        status: 1,
        doc_id: 1,
        "userinfo._id": 1,
        "userinfo.firstname": 1,
        "userinfo.lastname": 1,
        "userinfo.username": 1
      }
    },
    {
      $match: { roomId: new mongoose.Types.ObjectId(data.roomId) }
    }
  ])
    .sort({ createDate: -1 })
    .exec((err, results) => {
      if (!err) {
        callback(false, { data: results });
      } else {
        callback(true, { data: [] });
      }
    });
};

RoomMessagesSchema.statics.addMessage = function(message, callback) {
  roomMessageSchema = new RoomMessages(message);
  var error = roomMessageSchema.validateSync();
  if (error) {
    callback(true, {
      error: error.errors[Object.keys(error.errors)[0]].message
    });
  } else {
    roomMessageSchema.save();
    User.findById(message.senderId, function(err, user) {
      if (!err) {
        var data = {
          _id: roomMessageSchema._id,
          message: roomMessageSchema.message,
          created_date: roomMessageSchema.created_date,
          status: roomMessageSchema.status,
          type: roomMessageSchema.type,
          userinfo: {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username
          }
        };
        callback(false, { data: data });
      } else {
        callback(false, { data: roomMessageSchema });
      }
    });
  }
};

var RoomMessages = mongoose.model("room_messages", RoomMessagesSchema);
module.exports = RoomMessages;
