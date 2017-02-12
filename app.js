var bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
       express = require('express'),
           app = express();

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
// 	{
// 		name: 'Granite Hill', 
// 		image: 'https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg',
// 		description: 'This is a huge granite hill, no bathrooms. No water. Beautiful granite'
// 	},
// 	function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log('NEWLY CREATED CAMPGROUND: ');
// 			console.log(campground);
// 		}
// 	});

	
app.get('/', function(req, res){
	res.render('landing');
});

// INDEX ROUTE - show all campgrounds
app.get('/campgrounds', function(req, res){
	
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('index',{campgrounds: allCampgrounds});
		}
	});
	// res.render('campgrounds', {campgrounds:campgrounds});
	
});

// CREATE ROUTE - add new campground to database
app.post('/campgrounds', function(req, res){
	// Get name and image from request using bodyParser
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	
	// Create a new Campground using the req variables
	var newCampground = {
		name: name,
		image: image,
		description: desc
	};
	
	// Save the new Campground to database
	Campground.create(newCampground, function(err, newlyCreatedCampground){
		if(err){
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}	
	});
		
});

// NEW ROUTE - show form to create new campground
app.get('/campgrounds/new', function(req, res){
	
	res.render('new.ejs');
	
});

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req, res){
	
	// find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		
		if(err){
			console.log(err);
		} else {
			// render show template with that campground
			res.render('show', {campground: foundCampground});
		}
	});
});

app.listen(process.env.PORT,process.env.IP, function(){
	console.log('The YelpCamp server has started!');
});