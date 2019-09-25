var mongoose = require("mongoose");

IS_SEEN = 1;
IS_NOT_SEEN = 0;
STATUS_DELIVERED = 1;
STATUS_NOT_DELIVERED = 0;

var MessagesSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  reciever: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  type: {
    type: String,
    enum: ["text", "image", "location", "voice", "other", "video"],
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
    required: true
  },
  is_seen: {
    type: Number,
    enum: [IS_SEEN, IS_NOT_SEEN],
    required: true
  },
  created_date: {
    type: Date,
    required: true
  }
});

var Messages = mongoose.model("messages", MessagesSchema);
module.exports = Messages;
