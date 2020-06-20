var express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
var User = require("../models/User");
var CONFIG = require('../config/config');
var Rooms = require("../models/Rooms");
var Widget = require("../models/WidgetPG");
var Plans = require('../models/PlansPG');
var RegFields = require('../models/RegFieldsPG');
var Agencies = require('../models/AgenciesPG');
var AgencieRegFields = require('../models/AgencieRegFieldsPG');
var UserPG = require('../models/UserPG');
var OffersPG = require('../models/OffersPG');
var ChatRoomsPG = require('../models/ChatRoomsPG');
var BillingPlansPG = require('../models/BillingPlansPG');
var CouponsPG = require('../models/CouponsPG');
var router = express.Router();

const apiVersion = "/api/v1";


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// router.post("/api/login", function(req, res, next) {
//   if (req.body) {
//     User.login(req.body, function(err, response) {
//       if (err) {
//         res.send({ success: false, error: response.error });
//       } else {
//         res.send({ success: true, data: response.data });
//       }
//     });
//   } else {
//     res.send({ success: false, error: "Missing required parameters" });
//   }
// });

// router.post("/api/register", function(req, res, next) {
//   console.log(req.body);
//   if (req.body) {
//     User.register(req.body, function(err, response) {
//       if (err) {
//         return res.send({ success: false, error: response.error });
//       } else {
//         return res.send({ success: true, data: response.data });
//       }
//     });
//   } else {
//     res.send({ success: false, error: "Missing required parameters" });
//   }
// });

router.post("/api/createroom", function (req, res, next) {
  if (req.body) {
    Rooms.createRoom(req.body, function (err, response) {
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

router.post("/api/deleteroom", function (req, res, next) {
  console.log("req.body: ", req.body);
  Rooms.remove({ _id: req.body }, function (err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response });
    }
  })
})

router.post("/api/rooms", function (req, res, next) {
  Rooms.find({}, function (err, response) {
    if (err) {
      return res.send({ success: false, error: response.error });
    } else {
      return res.send({ success: true, data: response });
    }
  });
});

/* Widget APIs */
router.get(apiVersion + "/getWidgets", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Widget.getWidgets(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.get(apiVersion + "/getActiveWidgets", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Widget.getActiveWidgets(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.post(apiVersion + "/createWidget", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Widget.createWidget(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/updateWidget", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Widget.updateWidget(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/deactivateWidget", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 0
      Widget.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/activateWidget", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 1
      Widget.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion + "/deleteWidget", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Widget.deleteWidget(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

/* Plan APIs */
router.get(apiVersion + "/getPlans", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Plans.getPlans(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.get(apiVersion + "/getActivePlans", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Plans.getActivePlans(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.post(apiVersion + "/createPlan", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Plans.createPlan(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/updatePlan", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Plans.updatePlan(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/deactivatePlan", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 0
      Plans.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/activatePlan", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 1
      Plans.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion + "/deletePlan", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Plans.deletePlan(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

/* RegistrationFields APIs */
router.get(apiVersion + "/getRegFields", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      RegFields.getRegFields(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.get(apiVersion + "/getActiveRegFields", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      RegFields.getActiveRegFields(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.post(apiVersion + "/createRegField", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      RegFields.createRegField(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/updateRegField", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      RegFields.updateRegField(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/deactivateRegField", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 0
      RegFields.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/activateRegField", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 1
      RegFields.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion + "/deleteRegField", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      RegFields.deleteRegField(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

/* Agency APIs */
router.get(apiVersion + "/getAgencies", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Agencies.getAgencies(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.get(apiVersion + "/getActiveAgencies", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Agencies.getActiveAgencies(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.post(apiVersion + "/createAgency", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Agencies.createAgency(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/updateAgency", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Agencies.updateAgency(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/deactivateAgency", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 0
      Agencies.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/activateAgency", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 1
      Agencies.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion + "/deleteAgency", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      Agencies.deleteAgency(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

/* Agency Registration Fields APIs */
router.get(apiVersion + "/getAgencyRegFields", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      AgencieRegFields.getAgencyRegFields(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.post(apiVersion + "/createAgencyRegFields", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      AgencieRegFields.createAgencyRegFields(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/updateAgencyRegFields", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      AgencieRegFields.updateAgencyRegFields(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion + "/deleteAgencyRegField", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      AgencieRegFields.deleteAgencyRegField(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

/* User APIs */
router.post(apiVersion + "/login", function (req, res) {
  UserPG.loginUser(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      const user = response.data;
      generateToken(user, function (err, token) {
        if (!err) {
          return res.status(response.status).send({ success: true, data: response.data, token });
        }
      })
      // jwt.sign(user, CONFIG.PRIVATE_KEY, { algorithm: 'RS256' }, (err, token) => {
      //   return res.status(response.status).send({ success: true, data: response.data, token });
      // });
    }
  });
});
router.post(apiVersion + "/forgot-password", function (req, res) {
  UserPG.userForgotPassword(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});

router.post(apiVersion + "/register", function (req, res) {
  UserPG.createUser(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      const user = response.data;
      generateToken(user, function (err, token) {
        console.log(err);
        console.log(token);
        if (!err) {
          return res.status(response.status).send({ success: true, data: response, token });
        }
      })
    }
  });
});

router.put(apiVersion + "/updateUser", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      UserPG.updateUser(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          const user = response.data;
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.get(apiVersion + "/getUser", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      UserPG.getUser(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/deactivateUser", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 0
      UserPG.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion + "/activateUser", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      req.body.status = 1
      UserPG.updateStatus(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion + "/deleteUser", verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
    } else {
      UserPG.deleteUser(req, function (err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

router.post(apiVersion + "/migrate/users", verifyAdminToken, function (req, res) {
  UserPG.migrateUser({}, function (err, response) {
    return res.status(200).send({ success: (err ? false : true), data: response });
  });
});

/* Offers APIs */
router.get(apiVersion + "/getOffers", verifyAdminToken, function (req, res) {
  OffersPG.getOffers(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.post(apiVersion + "/createOffer", verifyAdminToken, function (req, res) {
  OffersPG.createOffer(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/updateOffer", verifyAdminToken, function (req, res) {
  OffersPG.updateOffer(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.delete(apiVersion + "/deleteOffer", verifyAdminToken, function (req, res) {
  OffersPG.deleteOffer(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});

/* ChatRoom APIs */
router.get(apiVersion + "/getChatRooms", verifyAdminToken, function (req, res) {
  ChatRoomsPG.getChatRooms(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.post(apiVersion + "/createChatRoom", verifyAdminToken, function (req, res) {
  ChatRoomsPG.createChatRoom(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/updateChatRoom", verifyAdminToken, function (req, res) {
  ChatRoomsPG.updateChatRoom(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.delete(apiVersion + "/deleteChatRoom", verifyAdminToken, function (req, res) {
  ChatRoomsPG.deleteChatRoom(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});

/* BillingPlans APIs */
router.get(apiVersion + "/getBillingPlans", verifyAdminToken, function (req, res) {
  BillingPlansPG.getBillingPlans(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.get(apiVersion + "/getActiveBillingPlans", verifyAdminToken, function (req, res) {
  BillingPlansPG.getActiveBillingPlans(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.post(apiVersion + "/createBillingPlan", verifyAdminToken, function (req, res) {
  BillingPlansPG.createBillingPlan(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/updateBillingPlan", verifyAdminToken, function (req, res) {
  BillingPlansPG.updateBillingPlan(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/deactivateBillingPlan", verifyAdminToken, function (req, res) {
  req.body.status = 0
  BillingPlansPG.updateStatus(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/activateBillingPlan", verifyAdminToken, function (req, res) {
  req.body.status = 1
  BillingPlansPG.updateStatus(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.delete(apiVersion + "/deleteBillingPlan", verifyAdminToken, function (req, res) {
  BillingPlansPG.deleteBillingPlan(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});

/* Coupons APIs */
router.get(apiVersion + "/getCoupons", verifyAdminToken, function (req, res) {
  CouponsPG.getCoupons(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.get(apiVersion + "/getActiveCoupons", verifyAdminToken, function (req, res) {
  CouponsPG.getActiveCoupons(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.post(apiVersion + "/createCoupon", verifyAdminToken, function (req, res) {
  CouponsPG.createCoupon(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/updateCoupon", verifyAdminToken, function (req, res) {
  CouponsPG.updateCoupon(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/deactivateCoupon", verifyAdminToken, function (req, res) {
  req.body.status = 0
  CouponsPG.updateStatus(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.put(apiVersion + "/activateCoupon", verifyAdminToken, function (req, res) {
  req.body.status = 1
  CouponsPG.updateStatus(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});
router.delete(apiVersion + "/deleteCoupon", verifyAdminToken, function (req, res) {
  CouponsPG.deleteCoupon(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data });
    }
  });
});

/* Admin APIs */
router.post(apiVersion + "/admin/contacts", verifyAdminToken, function (req, res) {
  UserPG.getAllUser(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      const user = response.data;
      jwt.sign({ user }, 'secretkey', (err, token) => {
        return res.status(response.status).send({ success: true, data: response.data, token });
      });
    }
  });
});

router.post(apiVersion + "/admin/create-user", verifyAdminToken, function (req, res) {
  UserPG.createUser(req, function (err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data});
    }
  });
});



function generateToken(payload, callback) {
  fs.readFile(__dirname + '/../keys/jwtRS256.key', function (err, key) {
    if (err) {
      console.log('error reading the file', err);
    } else {
      jwt.sign(payload, { key: key }, { algorithm: 'RS256' }, function (err, token) {
        callback(err, token);
      });
    }
  });
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader && bearerHeader !== undefined) {
    const bearer = bearerHeader.trim().split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    fs.readFile(__dirname + '/../keys/jwtRS256.key.pub', function (err, key) {
      jwt.verify(bearerToken, key, function (err, decoded) {
        if (!err) {
          req.user = decoded;
          next();
        } else {
          return res.status(403).json({
            success: false,
            error: {
              message: 'Unauthorized access'
            }
          });
        }
      });
    })
  } else {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Unauthorized access'
      }
    });
  }
}

function verifyAdminToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader && bearerHeader !== undefined) {
    const bearer = bearerHeader.trim().split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    fs.readFile(__dirname + '/../keys/jwtRS256.key.pub', function (err, key) {
      jwt.verify(bearerToken, key, function (err, decoded) {
        if (!err && decoded && decoded.role_id == 1) {
          req.user = decoded;
          next();
        } else {
          return res.status(403).json({
            success: false,
            error: {
              message: 'Unauthorized access'
            }
          });
        }
      });
    })
  } else {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Unauthorized access'
      }
    });
  }
}

module.exports = router;
