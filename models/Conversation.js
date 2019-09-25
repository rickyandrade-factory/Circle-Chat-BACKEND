var mongoose = require("mongoose");

var ConversationSchema = new mongoose.Schema({
  user_one: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  user_two: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  last_message: {type: String, required: true }
});

var Conversation = mongoose.model("conversation", ConversationSchema);
module.exports = Conversation;
