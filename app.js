var express = require('express');
var app = express();
var Application = require('./models/application.js').Application;
var mongoose = require("mongoose");

var uristring =
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/kiva-project';

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

//controllers
var controller = require('./controllers/controller.js');

//other boiler plate
app.use(express.static(__dirname + '/public'));
app.use(express.logger("default"));
app.use( express.cookieParser() );
app.use(express.session({secret:'session'}));
app.use(express.bodyParser())
   .use(express.methodOverride())
   .use(app.router)
   .use(express.multipart());


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

//General
app.get("/", controller.index);
app.post("/login", controller.login);
app.get("/load_application/:org_id", controller.load_application);
app.get("/logout", controller.logout);

//Volunteer
app.get("/volunteer/get_min_reviewed_application", controller.get_min_reviewed_application);
app.get("/volunteer/load", controller.load_volunteer);
app.post("/volunteer/submit-volunteer", controller.create_volunteer);
app.get("/volunteer/sign-up", controller.volunteer_signup_page);
app.get("/volunteer/home", controller.volunteer_home);
app.get("/volunteer/training", controller.volunteer_training);
app.get("/volunteer/finished-training", controller.volunteer_finished_training);
app.post("/review/create/:id", controller.create_review); // org_id here
app.get("/review/edit/:id", controller.edit_review); // review id
app.post("/review/save/:id", controller.save_review); // review id
app.get("/review/load/:id", controller.load_unfinished_review);
app.post("/review/submit/:id", controller.submit_review); // review id
app.get("/review/completed/:org_id", controller.completed_review_page); //org_id
app.get("/review/completed/load/:org_id", controller.load_completed_reviews);

//Admin
app.get("/admin/sign-up", controller.admin_signup_page);
app.post('/admin/submit-admin', controller.create_admin);
app.get("/admin_submit", controller.submit_application);
app.get("/admin/home", controller.admin_home);
app.post("/post-application", controller.create_application);
app.get("/admin_applications", controller.view_applications);
app.get("/admin/application/:id", controller.view_one_application);

module.exports = app;