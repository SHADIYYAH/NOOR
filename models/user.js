const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname:{
        type: String ,
        required: true,
    },
    username : {
        type: String, 
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
      },
      passwordHash: {
        type: String,
        required: true,
      },
      passwordSalt: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      updatedAt: {
        type: Date,
        default: new Date(),
      },
})

const Users = mongoose.model("Users", UserSchema);

module.exports={Users}