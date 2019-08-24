const express    = require('express');
const router     = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// Regex Fuzzy search with Regular Expressions
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// INDEX ROUTE Show all Campgrounds
router.get("/", function(req, res){
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allCampgrounds){
			if(allCampgrounds.length < 1) {
				req.flash('error', "Campground not found, please try again.");
				res.redirect('back');
			} else {
							  // Name of data - data being passed in (commonly called the same thing)
				res.render('campgrounds/index', {campgrounds: allCampgrounds});
			}
		});
	} else {
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
						  // Name of data - data being passed in (commonly called the same thing)
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	});
	}
});


// CREATE ROUTE Add new Campground to Database
router.post("/", middleware.isLoggedIn, function(req, res){
	// Get data from form and add to campgrounds array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {name: name, price: price, image: image, description: desc, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});


// NEW ROUTE Show Form to create new Campground
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new');
});


// SHOW ROUTE - shows more info about one Campground
router.get('/:id', function(req, res){
	// Find the Campground with the provided ID			   //.exec executes the query just before
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err || !foundCampground) {
			req.flash('error', 'Campground Not Found!');
			res.redirect('back');
		} else {
			console.log('foundCampground');
			// Render the show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});


// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	// Find and Update the correct Campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err) {
			res.redirect('/campgrounds');
		} else {
			// Redirect to the Updated Show Page
			req.flash('success', 'Campground Updated!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;