var db = require('../config');
var crypto = require("crypto");
var Promise = require('bluebird');
// var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var bcrypt = require('bcrypt-nodejs');
var util = require('../../lib/utility.js');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  initialize: function() {


    this.on('creating', function(model, attrs, options){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(model.get('hashpass'), salt);
      model.set('hashpass', hash);
    });

  }
  ,

  /* psuedocode for login
  method takes in username, password
  checks for users in db, if true then get both values (username, hashpass)
  hashes the password with bcrypt(password)
  if bcrypt(password) = hashpass then the user is authorized, else unauthorized
  bcrypt.compareSync("bacon", hash);

  */

});

module.exports = User;


User.checkUser = function(username){

//  console.log(db.knex.raw('select * from users'), "LOOK HERE!");
// db.knex returns a promise object!
var userRecord = db.knex('users').where({'username': username}).then(function (userRecord){
console.log("user record: ", userRecord);
  return true;
});


//this gives an accurate description of what's happening with knex
//  https://github.com/tgriesser/knex/issues/29

  // var userRecord = db.knex('users').select('id')();
  //          // .where({
  //          //  username: username
  //          //  })
  //          // .select('id');
  // console.log(userRecord);
  // return userRecord;


//   // if(model.get('username', username)){
//   //   console.log('user:', username, 'exists. Try another name');
//   // }

}
