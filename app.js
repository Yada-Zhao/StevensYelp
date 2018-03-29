var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    restaurant = require("./models/restaurant"),
    Comment    = require("./models/comment"),
    User       = require("./models/user")
    //seedDB      = require("./seeds")
    //  require routes
var commentRoutes = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/stevens_yelp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();
// seed the database


    //  passport configuration
app.use(require("express-session")({
    secret: "Some restaurants around Stevens I like",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

    //  在每个routes里都可以调用 currentUser, error, success
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");       //???
   res.locals.success = req.flash("success");   //???
   next();
});
    //  节省“/xxx”前缀的写法
app.use("/", indexRoutes);
app.use("/restaurants",restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The StevensYelp Server Has Started!");
});


