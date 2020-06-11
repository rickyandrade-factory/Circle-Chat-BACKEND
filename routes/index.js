var express = require("express");
const jwt = require("jsonwebtoken");
var User = require("../models/User");
var Rooms = require("../models/Rooms");
var Widget = require("../models/WidgetPG");
var Plans = require('../models/PlansPG');
var RegFields = require('../models/RegFieldsPG');
var Agencies = require('../models/AgenciesPG');
var AgencieRegFields = require('../models/AgencieRegFieldsPG');
var UserPG = require('../models/UserPG');
var router = express.Router();

const apiVersion = "/api/v1";

/* GET home page. */
router.get("/", function(req, res, next) {
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
router.get(apiVersion+"/getWidgets", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Widget.getWidgets(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.get(apiVersion+"/getActiveWidgets", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Widget.getActiveWidgets(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.post(apiVersion+"/createWidget", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Widget.createWidget(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/updateWidget", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Widget.updateWidget(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/deactivateWidget", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else { 
      req.body.status = 0
      Widget.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion+"/activateWidget", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      req.body.status = 1
      Widget.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion+"/deleteWidget", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      Widget.deleteWidget(req, function(err, response) {
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
router.get(apiVersion+"/getPlans", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Plans.getPlans(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.get(apiVersion+"/getActivePlans", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Plans.getActivePlans(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.post(apiVersion+"/createPlan", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Plans.createPlan(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/updatePlan", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Plans.updatePlan(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/deactivatePlan", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else { 
      req.body.status = 0
      Plans.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion+"/activatePlan", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      req.body.status = 1
      Plans.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion+"/deletePlan", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      Plans.deletePlan(req, function(err, response) {
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
router.get(apiVersion+"/getRegFields", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			RegFields.getRegFields(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.get(apiVersion+"/getActiveRegFields", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			RegFields.getActiveRegFields(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.post(apiVersion+"/createRegField", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			RegFields.createRegField(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/updateRegField", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			RegFields.updateRegField(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/deactivateRegField", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else { 
      req.body.status = 0
      RegFields.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion+"/activateRegField", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      req.body.status = 1
      RegFields.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion+"/deleteRegField", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      RegFields.deleteRegField(req, function(err, response) {
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
router.get(apiVersion+"/getAgencies", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Agencies.getAgencies(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.get(apiVersion+"/getActiveAgencies", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Agencies.getActiveAgencies(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.post(apiVersion+"/createAgency", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Agencies.createAgency(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/updateAgency", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			Agencies.updateAgency(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/deactivateAgency", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else { 
      req.body.status = 0
      Agencies.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion+"/activateAgency", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      req.body.status = 1
      Agencies.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion+"/deleteAgency", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      Agencies.deleteAgency(req, function(err, response) {
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
router.get(apiVersion+"/getAgencyRegFields", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			AgencieRegFields.getAgencyRegFields(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.post(apiVersion+"/createAgencyRegFields", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			AgencieRegFields.createAgencyRegFields(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/updateAgencyRegFields", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			AgencieRegFields.updateAgencyRegFields(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.delete(apiVersion+"/deleteAgencyRegField", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      AgencieRegFields.deleteAgencyRegField(req, function(err, response) {
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
router.post(apiVersion+"/login", function(req, res) { 
  UserPG.loginUser(req, function(err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      const user = response.data;
      jwt.sign({user}, 'secretkey', (err, token) => {
        return res.status(response.status).send({ success: true, data: response.data, token });
      });
    }
  });
});
router.post(apiVersion+"/forgot-password", function(req, res) { 
  UserPG.userForgotPassword(req, function(err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      return res.status(response.status).send({ success: true, data: response.data});
    }
  });
});
router.post(apiVersion+"/register", function(req, res) { 
  UserPG.createUser(req, function(err, response) {
    if (err) {
      return res.status(response.status).send({ success: false, error: response.data });
    } else {
      const user = response.data;
      jwt.sign({user}, 'secretkey', (err, token) => {
        return res.status(response.status).send({ success: true, data: response, token });
      });
    }
  });
});
router.put(apiVersion+"/updateUser", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      UserPG.updateUser(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          const user = response.data;
          return res.status(response.status).send({ success: true, data: response.data});
        }
      });
    }
  });
});
router.get(apiVersion+"/getUser", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
			UserPG.getUser(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
		}
	});
});
router.put(apiVersion+"/deactivateUser", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else { 
      req.body.status = 0
      UserPG.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.put(apiVersion+"/activateUser", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      req.body.status = 1
      UserPG.updateStatus(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});
router.delete(apiVersion+"/deleteUser", verifyToken, function(req, res) { 
  jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
      return res.status(403).json({ success: false, 
        error: { 
          message: 'Unauthorized access'
        }
      });
		} else {
      UserPG.deleteUser(req, function(err, response) {
        if (err) {
          return res.status(response.status).send({ success: false, error: response.data });
        } else {
          return res.status(response.status).send({ success: true, data: response.data });
        }
      });
    }
  });
});

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if(bearerHeader !== 'undefined' && bearerHeader !== undefined) {
		const bearer = bearerHeader.trim().split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		return res.status(403).json({ success: false, 
      error: { 
        message: 'Unauthorized access'
      }
    });
	}
}

module.exports = router;
