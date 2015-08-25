var db = require('../config');
var crypto = require("crypto");
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var util = require('../../lib/utility.js');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  initialize: function() {


    this.on('creating', function(model, attrs, options){
      var hash = bcrypt.hash(model.get('hashpass'), 10)
          .then(function(hash){
            model.set('hashpass', hash);
          });
    });





    // var entry = this;

    // var hash = function(credentials){
    //   return bcrypt.genSaltAsync(10).then(function(result){
    //     return bcrypt.hashAsync(credentials.hashpass, result, null)
    //     .then(function(result){
    //       return result})
    //   })
    // }

    // console.log("this", this, "inside the init user model");
    //   credentials.hashpass = hash(credentials);
    //   console.log('credentials', credentials);
      // model.set('username', credentials.username);
      // model.set('hashpass', credentials.hashpass);








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
