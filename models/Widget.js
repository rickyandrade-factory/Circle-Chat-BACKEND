var mongoose = require("mongoose");
var fs = require("fs");

var STATUS_VERIFIED = 1;
var STATUS_UNVERIFIED = 0;
var SIDE = "side";
var TOP = "top";

var WidgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [STATUS_VERIFIED, STATUS_UNVERIFIED],
    required: true
  },
  position: {
    type: String,
    enum: [SIDE, TOP],
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

WidgetSchema.statics.getAllWidgets = function(callback) {
  Widget.find({}, function(
    err,
    result
  ) {
    if (err) {
      callback(true, { error: "Error processing your request" });
    } else {
      if (!result) {
        callback(true, {
          error: "No widget found."
        });
      } else {
        callback(false, { data: result });
      }
    }
  });
};

WidgetSchema.statics.getActiveWidgets = function(callback) {
  Widget.find({ status: 1 }, function(
    err,
    result
  ) {
    if (err) {
      callback(true, { error: "Error processing your request" });
    } else {
      if (!result || result.length <= 0) {
        callback(true, {
          error: "No widget found."
        });
      } else {
        callback(false, { data: result });
      }
    }
  });
};

WidgetSchema.statics.updateStatus = function(post, callback) {
  if(post) {
    if (!post.hasOwnProperty("id") || !post.id) {
      callback(true, { error: "Missing required parameters" });
      return false;
    }
    var where = { _id: post.id };
    var statusData = { $set: {status: post.status} }
    Widget.updateOne(where, statusData, function(err, result) {
      if(err) {
        callback(true, { error: result })
      } else {
        if(post.status==0) {
          callback(false, { data: "Widget Deactivated successfully" });
        } else {
          callback(false, { data: "Widget Activated successfully" });
        }
      }
    });
  } else {
    callback(true, { error: "Missing required parameters" });
  }
};

WidgetSchema.statics.createWidget = function(post, callback) {
  if (post) {
    widgetSchema = new Widget(post);
    var error = widgetSchema.validateSync();
    if (error) {
      callback(true, {
        error: error.errors[Object.keys(error.errors)[0]].message
      });
    } else {
      this.find({ name: post.name }, function(err, results) {
        if (results.length > 0) {
          callback(true, { error: "Widget already created with this name" });
        } else {
          widgetSchema.save();
          callback(false, { data: "Widget created successfully" });
        }
      });
    }
  } else {
    callback(true, { error: "Missing required parameters" });
  }
};

var Widget = mongoose.model("widget", WidgetSchema);
module.exports = Widget;
