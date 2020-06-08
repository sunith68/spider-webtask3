const express= require('express');
const homeRouter=require('./routes/routes')
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash')
const passport = require('passport');
const app = express();
const initializePassport = require('./config/passport')
const Account = require('./models/account')


mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

// initializePassport(
//   passport,
//   username => Account.findOne(user => user.username === username),
//   id => Account.findOne(user => user.id === id)
// )
// initializePassport(
//   passport,
//   async (username)=>{console.log('username function');  return await Account.findone({username:username})},
//   (username)=>{return Account.findById(id)}
//  )
initializePassport(passport)
//hello

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(flash());

app.use(session({
  secret: 'two thousand twenty',
  resave: false,
  saveUninitialized: false
}));


app.use(express.static(__dirname + '/public'));




// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/',homeRouter);

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});



app.listen(3000,function(){
	console.log('you are listening to port 3000');
})