// Initializing Express
const express       = require('express');
// Saving express to app constant or variable
const app           = express();
// Setting constant port value
const bodyParser     = require('body-parser'),
	  mongoose       = require('mongoose'),
	  flash          = require('connect-flash'),
	  passport       = require('passport'),
	  LocalStrategy  = require('passport-local'),
	  methodOverride = require('method-override'),
      Campground     = require('./models/campground'),
	  Comment        = require('./models/comment'),
	  User           = require('./models/user'),
	  seedDB	     = require('./seeds');

// REQUIRING ROUTES
let commentsRoutes      = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

// MONGO CONFIGURATION
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set("useFindAndModify", false);
mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// SEED DATA
// seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Samwise the brave',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments',commentsRoutes);

let listener = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 3000
});