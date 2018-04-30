const express                 = require("express"),
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      bodyParser              = require("body-parser"),
      LocalStrategy           = require("passport-local"),
      passportLocalMongoose   = require("passport-local-mongoose"),
      User                    = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");


var app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
   secret: "Sabres are bad but not forever hopefully",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE

// caching disabled for every route so you cannot go back after logout
app.use(function(req, res, next) {
   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   next();
});

//check if logged in before display dashboard
function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
}

//+++++++++++++++++++++++++++++++
//ROUTES

//AUTH ROUTES
app.get("/register", (req, res) => {
   res.render("register");
});

//POST LOGIN
app.post("/register", (req, res) => {
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if(err) {
         console.log(err);
         return res.render("register");
      } else {
         passport.authenticate("local")(req, res, () => {   //log user in
            res.redirect("secret");
         });
      }
   });
});

//LOGIN ROUTES
app.get("/login", (req, res) => {
   res.render("login");
});

app.post("/login", passport.authenticate("local", 
   {
      successRedirect: "/secret",
      failureRedirect: "/login"
   }), 
   (req, res) => {

});

//SHOW ROUTES
app.get("/", (req, res) => {
   res.render("home");
});

//LOGOUT
app.get("/logout", (req, res) => {
   req.logout();
   res.redirect("/");
});

app.get("/secret", isLoggedIn, (req, res) => {
   res.render("secret");
});



app.listen(3000, () => {
   console.log("running");
});