var express = require("express");
var User = require('../models/User')
var Rooms = require('../models/Rooms');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/api/login", function(req, res, next) {
  if(req.body){
    User.login(req.body, function(err, response) {
      if(err){
        res.send({success: false, error: response.error});
      }else{
        res.send({success: true, data: response.data});
      }
    });
  }else{
    res.send({success: false, error: "Missing required parameters"});
  }
});

router.post("/api/register", function(req, res, next) {
  console.log(req.body);
  if(req.body){
    User.register(req.body, function(err, response){
      if(err){
        return res.send({success: false, error: response.error});
      }else{
        return res.send({success: true, data: response.data});  
      }
    });
  }else{
    res.send({success: false, error: "Missing required parameters"});
  }
});

router.post("/api/createroom", function(req, res, next){
  if(req.body){
    Rooms.createRoom(req.body, function(err, response){
      if(err){
        console.log(response.error);
        return res.send({success: false, error: response.error});
      }else{
        return res.send({success: true, data: response.data});   
      }
    });
  }else{
    res.send({success: false, error: "Missing required parameters"});
  }
});


module.exports = router;
