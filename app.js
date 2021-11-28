const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} = require('./middleware/authMiddleware')

const app = express();

// middleware
//use static files in public folder
app.use(express.static('public'));
app.use(express.json())  //it parses any json data coming with request to javascript object so as to use  by attaching to request and access in our request handlers

app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/smoothiesjwt';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
//checking for user at every single get request
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));

app.use(authRoutes)

//cookies
// app.get('/set-cookies',(req, res) => {
//   // res.setHeader('Set-Cookie','newUser=true')
//   //WILL DO SAME AS ABOVE 
//   //this will make new cookie or update such existing cookie
//   res.cookie('newUser',false)
//   //3rd argument is an options object
//   //secure: true means cookie will be set only over https(secure) connection
//   res.cookie('isEmployee',true,{maxAge: 1000*60*60*24, 
//     httpOnly: true , //now cookie can be handled only on http requests not on frontend JS
//     secure: true})



//   res.send('You got the cookies')
// })

// app.get('/read-cookies',(req, res) => {

//   const cookies = req.cookies
//   console.log(cookies.newUSer)
//   res.json(cookies)
// })


//with websites having state changing end-points cookies are not safe as they can 
//be used by malicious website to act like user and get access to data