var db = require('../config');
var crypto = require("crypto");
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var util = require('../../lib/utility.js');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  initialize: function() {
    console.log("this", this, "inside the init user model");

    var credentials = this.attributes;
    util.encryptPass(credentials.hashpass, function(hash){
      credentials.hashpass = hash;
    })
    this.set('username', credentials.username);
    this.set('hashpass', credentials.hashpass);
    console.log('credentials', credentials);

    // this.set('username', this.attributes.username);
    // var hashPass = util.encryptPass(this.attributes.hashpass, function(hash){
    //   console.log("inside callback", hash);
    //   return hash
    // });
    // console.log("outide callback", hash);
    // this.set('hashpass', hashPass);
  }
});

module.exports = User;


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   clicks: function() {
//     return this.hasMany(Click);
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;



      // click.save().then(function() {
      //   db.knex('urls')
      //     .where('code', '=', link.get('code'))
      //     .update({
      //       visits: link.get('visits') + 1,
      //     }).then(function() {
      //       return res.redirect(link.get('url'));
      //     });
      // });
