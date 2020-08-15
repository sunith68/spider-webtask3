const express= require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const Article = require('../models/article')
const User = require('../models/users')
const Account = require('../models/account')

router.get('/',checkAuthenticated, async function (req,res){
  const articles =  await Article.find();
  // .sort({ createdAt: 'desc' })
  res.render('home',{articles:articles})
});

router.get('/login',checkNotAuthenticated, function(req,res){
	res.render('login');
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/signup',checkNotAuthenticated,function(req,res){
	res.render('signup');
})

router.post('/signup', checkNotAuthenticated, async (req, res) => {

	let temp = await Account.findOne({username: req.body.username });
	if(temp!=null){
		req.flash('error','Username already exists')
		res.redirect('/signup');
	}
	if(req.body.username.indexOf(' ')>0){
		req.flash('error','Username should not contain spaces')
		res.redirect('/signup');
	}
	if(req.body.password!=req.body.cpassword){
		req.flash('error','Match both the passwords')
		res.redirect('/signup');
	}
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let taccount= new Account();
	taccount.username=req.body.username;
	taccount.password=hashedPassword;
	taccount= await taccount.save();
    res.redirect('/login')
  } catch(e) {
    throw e
  }
})
router.post('/logout',function(req,res){
	req.logOut()
  	res.redirect('/login')
})

router.get('/add',checkAuthenticated,(req,res)=>{
	res.render('add');
})
router.post('/add',checkAuthenticated,async (req,res)=>{
	let article = new Article();
    article.title = req.body.title;
    article.description=req.body.description;
    article.author = req.user.username;
    article.content = req.body.content;
    await article.save();
    res.redirect('/');
})

router.get('/edit/:id',checkAuthenticated,async (req,res)=>{
	console.log(1);
	const article = await Article.findById(req.params.id);
	console.log(article.author);
	if(article.author != req.user.username){
		console.log(2);
	  return res.redirect('/');
	}
	console.log(3);
	res.render('edit', {article:article});
})

router.post('/edit/:id',checkAuthenticated,(req,res)=>{
	let article = {};
	article.title = req.body.title;
	article.author = req.user.username;
	article.description = req.body.description;
	article.content=req.body.content;

	Article.update({_id:req.params.id}, article, function(err){
		if(err){
		  console.log(err);
		  return;
		} else {
		  req.flash('success', 'Article Updated');
		  res.redirect('/');
		}
	});
})

router.get('/profile',checkAuthenticated,async (req,res)=>{
	const articles = await Article.find({author:req.user.username});
	res.render('userprofile',{articles:articles})
})

router.get('/read/:id',checkAuthenticated,async (req,res)=>{
	const article = await Article.findById(req.params.id);
	res.render('read',{article:article});
})
router.post('/delete/:id',checkAuthenticated,async (req,res)=>{
 	Article.remove({_id:req.params.id},function(err){
        if(err){
          console.log(err);
        }
    });
    res.redirect('/profile'); 
})

router.get('/search',checkAuthenticated,(req,res)=>{
	res.render('search',{username:""});
})
router.post('/search',checkAuthenticated,async(req,res)=>{
	const account=await Account.findOne({username: req.body.username })
	if (account==null) {
		res.render('search',{username:req.body.username})
	}
	else{res.render('search',{username:null, account:account})}
})

router.get('/profile/:username',checkAuthenticated,async (req,res)=>{
	const articles = await Article.find({author:req.params.username});
	res.render('profile',{articles:articles})
})


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


module.exports=router;
