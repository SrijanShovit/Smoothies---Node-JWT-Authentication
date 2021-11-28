const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        unique:true,
        lowercase:true,
        validate: [isEmail, 'Please enter a valid email']

    },
    password:{
        type:String,
        required:[true, 'Please enter an password'],
        minlength:[6, 'Minimum password length is 6 characters'],
    }
})

// //fire a function after doc saved to db
// userSchema.post('save', function (doc,next) {
//     console.log('New user was created & saved to db',doc)
//     next()
// })

//fire a function before doc saved to db
userSchema.pre('save',async function(next){
    //here we don't get doc as it has not been saved
    //normal function is being used bcz we want to refer to this user's instance using this keyword
    // console.log('user about to be created & saved',this)

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()

})


//static method to login user
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if (user){
        const auth = await bcrypt.compare(password,user.password)
        if (auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}



const User = mongoose.model('user',userSchema)

module.exports = User