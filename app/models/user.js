var db = require('../config');
var crypto = require("crypto");
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  // initialize: function() {
  //   this.on('creating', function(model, attrs, options) {
  //     console.log("attrs", attrs, "models/user.js line 11");
  //     bcrypt.hash(attrs.hashpass, 8, null, function(err, hash) {
  //       model.set('username', attrs.username);
  //       model.set('hashpass', hash);
  //       console.log("username", attrs.username, "hash", hash, "models/user.js line 15");
  //     });
  //   });
  // }
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
