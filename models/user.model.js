const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdat: {type: Date, default: Date.now},
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
})

userSchema.pre("save", function (next){
    bcryptjs.hash(this.password, 10).then((hashed)=>{
        this.password = hashed
        console.log(hashed);

        next()
    }).catch((err)=>{
        console.log(err);
    })
})

let userModel = mongoose.model("ProjectII", userSchema)

module.exports = userModel