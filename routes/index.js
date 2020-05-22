var express = require("express");
var User = require("../models/User");
var Rooms = require("../models/Rooms");
var Widget = require("../models/Widget");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/api/login", function(req, res, next) {
  if (req.body) {
    User.login(req.body, function(err, response) {
      if (err) {
        res.send({ success: false, error: response.error });
      } else {
        res.send({ success: true, data: response.data });
      }
    });
  } else {
    res.send({ success: false, error: "Missing required parameters" });
  }
});

router.post("/api/register", function(req, res, next) {
  console.log(req.body);
  if (req.body) {
    User.register(req.body, function(err, response) {
      if (err) {
        return res.send({ success: false, error: response.error });
      } else {
        return res.send({ success: true, data: response.data });
      }
    });
  } else {
    res.send({ success: false, error: "Missing required parameters" });
  }
});

router.post("/api/createroom", function(req, res, next) {
  if (req.body) {
    Rooms.createRoom(req.body, function(err, response) {
      if (err) {
        console.log(response.error);
        return res.send({ success: false, error: response.error });
      } else {
        return res.send({ success: true, data: response.data });
      }
    });
  } else {
    res.send({ success: false, error: "Missing required parameters" });
  }
});

router.post("/api/deleteroom", function(req, res, next) {
  console.log("req.body: ", req.body);
  Rooms.remove({ _id: req.body },function(err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response });
    }
  })
})

router.post("/api/rooms", function(req, res, next) {
  Rooms.find({}, function(err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response });
    }
  });
});

router.post("/api/createwidget", function(req, res, next) {
  if (req.body) {
    Widget.createWidget(req.body, function(err, response) {
      if (err) {
        return res.send({ success: false, error: response.error });
      } else {
        return res.send({ success: true, data: response.data });
      }
    });
  } else {
    res.send({ success: false, error: "Missing required parameters" });
  }
});

router.get("/api/getWidgets", function(req, res, next) {
  Widget.getAllWidgets(function(err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response.data });
    }
  });
});

router.get("/api/getActiveWidgets", function(req, res, next) {
  Widget.getActiveWidgets(function(err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response.data });
    }
  });
});

router.post("/api/deactivateWidget", function(req, res, next) {
  Widget.updateStatus(req.body, function(err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response.data });
    }
  });
});

router.post("/api/activateWidget", function(req, res, next) {
  Widget.updateStatus(req.body, function(err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response.data });
    }
  });
});

module.exports = router;
