const express = require("express");
const app = express();

const path = require("path");
const dotenv = require("dotenv");

const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userRoutes = require("./routes/user");

const User = require("./models/usermodel");

dotenv.config({ path: "./config.env" });

// Connecting to mongodb database
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

//middleware for express session
app.use(
  session({
    secret: "just a simple login/sign up application",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for connect flash
app.use(flash());

//Setting messages variables globally
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
app.use(userRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(port);
});
