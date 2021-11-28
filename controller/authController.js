const User = require('../models/User')
const jwt = require('jsonwebtoken')

//handle errors
const handleErrors = (err) => {
    console.log(err.message , err.code)
    let errors = {email: '' , password: ''}

    //incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'Email not registered'
    }

    //incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'Incorrect Password'
    }

    //duplicate error code
    if (err.code === 11000){
        errors.email = 'The email already exists'
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        //only values ob object inside errors property of error

        //destructuring properties here
        Object.values(err.errors).forEach(({properties}) =>{
            // console.log(error.properties)
            errors[properties.path] = properties.message;

        })
    }

    return errors;

}

//create jwt
const maxAge = 3 * 24 * 60 * 60 //(jwt needs time in secs but cookies need in millisec)
const createToken = (id) => {
    //id is payload ; 2nd argument is secret which we want to attch to jwt and hash;should not exosed publicly
    return jwt.sign({id}, 'shlsdhjlsdvlshlsdjvfbhjfbjbjsaalALJA',{
        expiresIn : maxAge 
    })

}

module.exports.signup_get = (req,res) => {
    res.render('signup')
}

module.exports.login_get = (req,res) => {
    res.render('login')
}

module.exports.signup_post = async (req,res) => {
    const {email,password} = req.body
    // console.log(email,password)
    // res.send('new signup')
    try {
        //new instance of User created is saved locally and assigned to user
        const user = await User.create({email,password})
        const token = createToken(user._id)
        res.cookie('jwt',token,{ httpOnly: true,maxAge:maxAge*1000})
        res.status(201).json({user: user._id})
        // res.status(201).json(user)
    } catch (err) {
        let errors = handleErrors(err)
        res.status(400).json({ errors})
        
    }
}


module.exports.login_post = async (req,res) => {
    //req is coming from frontend using fetch
    const {email,password} = req.body
    // console.log(email,password)
    // res.send('user login')
    try {
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt',token,{ httpOnly: true,maxAge:maxAge*1000})
        //sending response to user
        res.status(200).json({user: user._id})
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }

}

module.exports.logout_get = async (req,res) => {
    //we can't delete a jwt from server
    //so we'll replace it token in cookie by empty string with 1 ms of age
    //this is as good as deleting it
    res.cookie('jwt','',{maxAge : 1})
    res.redirect('/login')
}