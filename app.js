var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

CONFIG = require("./config/config"); // Injecting Our Configuration

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
// app.post("/upload", function(req, res) {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.sampleFile;

//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv("/somewhere/on/your/server/filename.jpg", function(err) {
//     if (err) return res.status(500).send(err);

//     res.send("File uploaded!");
//   });
// });

app.use("/", indexRouter);
app.get("/*", function(req, res) {
  res.sendFile(
    path.resolve(path.normalize(__dirname, "") + "/views/index.html")
  );
});
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose.connect(
  CONFIG.DB_URL,
  {
    server: {
      socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 },
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
  },
  function(error) {
    if (error) {
      console.log("MongoDB connection error: ", error);
    }
  }
);

module.exports = app;