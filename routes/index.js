const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const User     = require('../models/user');

// ROOT ROUTE
router.get("/", function(req, res){
	res.render("landing");
});

// AUTHENTICATION ROUTES
//Show The Register Form
router.get('/register', function(req, res){
	res.render('register');
});


//Handling Sign Up Logic
router.post('/register', function(req, res){
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			req.flash('error', err.message);
			// return res.render('register');
			res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome To YelpCamp ' + user.username);
			res.redirect('/campgrounds');
		});
	});
});


//Show The Login Form
router.get('/login', function(req, res){
	res.render('login');
});


//Handling Login Logic
router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/campgrounds', 
		failureRedirect: '/login'
	}), function(req, res){
});


// Logout Route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Logged Out Successfully!');
	res.redirect('/campgrounds');
});

module.exports = router;