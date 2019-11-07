const mongoose=require('mongoose');
const bcrypt = require("bcrypt");


const UserSchema= new mongoose.Schema({
username:{
  type:String,
  required:true
}
,
password:{
  type:String,
  required:true
},
email:{
  type:String,
  required:true
},
category:{
    type:String
},
address:{
  type:String
},
token:{
  type:String
},

  postCount:{
    type:Number,
  default:0},

commentCount:{
      type:Number,
    default:0},

bookmarkCount:{
      type:Number,
    default:0
  },

photo:{
  type:String,
  default:'default.jpg'
}



},
{timestamps:true}
);

UserSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword, next) {
  try {
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};


const User=mongoose.model("User",UserSchema)

module.exports=User
