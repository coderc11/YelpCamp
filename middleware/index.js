const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ALL MIDDLEWARE GOES HERE
const middlewareObj = {
	
};

// CAMPGROUND OWNERSHIP MIDDLEWARE
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	//If User is Logged In
	if(req.isAuthenticated()){
		//Does this User own the Campground
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground) {
				req.flash('error', 'Campground Not Found!');
				res.redirect('back');
			} else {
				//Does this User own the Campground
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				}  else {
					req.flash('error', "You Don't Have Permission To Do That!");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You Must Be Logged In To Do That!');
		res.redirect('back');
	}
};

// CHECK COMMENT OWNERSHIP MIDDLEWARE
middlewareObj.checkCommentOwnership = function(req, res, next) {
	//If User is Logged In
	if(req.isAuthenticated()){
		//Does this User own the Comment
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash('error', 'Comment Not Found!');
				res.redirect('back');
			} else {
				//Does this User own the Comment
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				}  else {
					req.flash('error', "You Don't Have Permission To Do That!");
					res.redirect('back');
				}	
			}
		});
	} else {
		req.flash('error', 'You Need To Be Logged In To Do That!');
		res.redirect('back');
	}
};

// isLoggedIn MIDDLEWARE
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You Must Be Logged In To Do That!');
	res.redirect('/login');
};



module.exports = middlewareObj;