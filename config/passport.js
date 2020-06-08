const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Account = require('../models/account')

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const user = await Account.findOne({username:username});
    if (user == null) {
      return done(null, false, { message: 'No user found' })
    }
    console.log(password, user.password);
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    Account.findById(id, function(err, user) {
      done(err, user);
    });
  })
}

module.exports = initialize

// const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')
// const Account = require('../models/account')

// function initialize(passport, getUserByUsername, getUserById) {
//   const authenticateUser = async (username, password, done) => {
//     const user = getUserByUsername(username)
//     if (user == null) {
//       return done(null, false, { message: 'No user found' })
//     }

//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: 'Password incorrect' })
//       }
//     } catch (e) {
//       return done(e)
//     }
//   }

//   passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
// }

// module.exports = initialize