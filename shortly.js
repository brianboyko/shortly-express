var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/',
function(req, res) {
  // create anonymous session
  res.render('index');
});

app.get('/create',
function(req, res) {
  // if session doesn't exist (user is not logged in)
  // redirect to login
  res.render('index');
});

app.get('/links',
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/login',
function(req, res) {
  res.render('login'); // ???
});

app.get('/signup',
function(req, res) {
  res.render('signup'); ///
});


var sessions = {};

app.post('/login',
  function(req, res){
    console.log(req.body, "the request object");
    //get the username and password.


    //get the username from the database
    db.knex('users').where('username', req.body.username).then(function(userRecord){
      //if it doesnt exist in the db
      if(userRecord.length === 0 || userRecord == undefined) {
        //redirect them to the signup page
        res.redirect('/signup');
      } else {
        //if it does exist
        //hash the inputted password
        //compare the db hashpass and the hashed inputted-password
        if(bcrypt.compareSync(req.body.password, userRecord[0].hashpass)) {
          //add the user id and the identifier to the existing session
          //in-memory session creation (not using cookies)
          console.log("password matched!");
          var userID = userRecord[0].id;
          var sessionID = '45';
          sessions[sessionID] = {id: sessionID, userId: userID};
          res.session({ 'token': sessionID});

        } else {
          console.log("password doesn't match");
          //if no match,
          //clear the inputs and print password doesnot match to the page
          res.redirect('/login');
        }

      }
    });




  });

app.post('/signup',
  function(req, res) {

    /* NEW PSEUDOCODE */
    // Take in request username and password
    // perform a fetch on username in the db
    // if user exists, redirect to /login route
    // if user does not exist, create a new User,  and add that user to the db.
    // create a session on get request
    // associate that session with this user ID
    var userRecord = db.knex('users').where('username', req.body.username).then(function (userRecord){
    console.log("user record length", userRecord.length);
    if(!userRecord.length){
          console.log("Adding user", req.body.username, "Pass", req.body.password)
      var user = new User({
          username: req.body.username,
          hashpass: req.body.password
          });
      user.save().then(function(user){
        Users.add(user);
      });
    }
  });
});

app.get('/logout',
function(req, res) {
  console.log("you pressed logout!");
  // log user out by deleting the session ID
});
/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        db.knex('urls')
          .where('code', '=', link.get('code'))
          .update({
            visits: link.get('visits') + 1,
          }).then(function() {
            return res.redirect(link.get('url'));
          });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
