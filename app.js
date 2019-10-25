const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const os = require("os");

// Get the OS
const osType = os.type();

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// Load the router files
const coffeeRouter = require("./routes/coffee");

// Create express server
const app = express();

// Get the right mongodb URI for the right OS
const mongoURI =
  osType === "Darwin"
    ? process.env.DARWIN_MONGODB_URI
    : process.env.MONGODB_URI;

// Connect to Mongodb
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.connect(mongoURI);
mongoose.connection.on("error", err => {
  console.error(err);
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

// Express Configurations
app.set("host", process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0");
app.set("port", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true
    })
  })
);

app.use(cors());
app.use(
  "/",
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

// Application Routes
app.use("/coffee", coffeeRouter);

// Error Handler
if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server Error");
  });
}
//
app.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;
