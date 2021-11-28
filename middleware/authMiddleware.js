const jwt = require('jsonwebtoken')
const User = require('../models/User')

//here we'll check authenticity of token 
//which will be used for any protected route request

const requireAuth = (req,res,next) => {

    //get jwt named cookie bcz token is attached to cookie
    const token = req.cookies.jwt

    //check json web token exists & is verified
    if (token) {
        jwt.verify(token,'shlsdhjlsdvlshlsdjvfbhjfbjbjsaalALJA',(err,decodedToken) => {
            //if token is invalid
            if (err){
                console.log(err.message)
                res.redirect('/login')
                //we don't say next so we'll never get the view of smooothies
                //only get redirected to login
            }
            else{
                console.log(decodedToken)
                next()
            }
        })
    }
    //if token not found
    else{
        res.redirect('/login')
        //we don't say next so we'll never get the view of smooothies
                //only get redirected to login
    }


}

//check current user
const checkUser = (req,res,next) => {
    const token = req.cookies.jwt

    
    if (token) {
        jwt.verify(token,'shlsdhjlsdvlshlsdjvfbhjfbjbjsaalALJA',async (err,decodedToken) => {
           
            if (err){
                console.log(err.message)
                res.locals.user = null;
                next()
               
            }
            else{
                console.log(decodedToken)
                //the decoded token has id of user in payload as we gave it while creating token
                let user = await User.findById(decodedToken.id)
                //using locals we can inject the variable got here in views
                res.locals.user = user;
                
                next()
            }
        })
    }
   
    else{
        res.locals.user = null;
        next()
        
    }

}

module.exports = { requireAuth, checkUser}