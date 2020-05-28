var express = require("express");
var User = require("../models/User");
var Rooms = require("../models/Rooms");
// var Widget = require("../models/Widget");
var Widget = require("../models/WidgetPG");
// var Plan = require("../models/Plan");
var Plans = require('../models/PlansPG');
var RegFields = require('../models/RegFieldsPG');
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

/* Widget APIs */
router.get("/api/getWidgets", Widget.getWidgets);
router.get("/api/getActiveWidgets", Widget.getActiveWidgets);
router.post("/api/createWidget", Widget.createWidget);
router.put("/api/updateWidget", Widget.updateWidget);
router.put("/api/deactivateWidget", Widget.updateStatus);
router.put("/api/activateWidget", Widget.updateStatus);
router.delete("/api/deleteWidget", Widget.deleteWidget);

/* Plan APIs */
router.get("/api/getPlans", Plans.getPlans);
router.get("/api/getActivePlans", Plans.getActivePlans);
router.post("/api/createPlan", Plans.createPlan);
router.put("/api/updatePlan", Plans.updatePlan);
router.put("/api/deactivatePlan", Plans.updateStatus);
router.put("/api/activatePlan", Plans.updateStatus);
router.delete("/api/deletePlan", Plans.deletePlan);

/* RegistrationFields APIs */
router.get("/api/getRegFields", RegFields.getRegFields);
router.get("/api/getActiveRegFields", RegFields.getActiveRegFields);
router.post("/api/createRegField", RegFields.createRegField);
router.put("/api/updateRegField", RegFields.updateRegField);
router.put("/api/deactivateRegField", RegFields.updateStatus);
router.put("/api/activateRegField", RegFields.updateStatus);
router.delete("/api/deleteRegField", RegFields.deleteRegField);

module.exports = router;
