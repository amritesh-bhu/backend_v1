import mongoose from "mongoose";
import crypto from "crypto";
import { nanoid } from "nanoid";
// import Error from "Error";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt:{
        type:String,
    }
})

const userModel = new mongoose.model('users', userSchema)

const hashPassword = (password, salt) => {
    return crypto.createHash('md5').update(Buffer.from(password)).digest('hex') + salt
}

const authenticateUser = async ({username, password}) => {
    try {
        // console.log(username, password)
        const user = await userModel.findOne({ username })
        // console.log(user)
        if (!user) {
            throw new Error('no such user/password pair exist')
        }
        if (user.password == hashPassword(password, user.salt)) {
            return user
        }

        throw new Error('Invalid username and password')

    } catch(err) {
        console.log('Error Catch Something went wrong authenticating user',err)
        throw err;
    }
}

const createUser = async (username, password) => {
    try {
        const salt = nanoid(32)
        const newUser = await userModel.create({ username, password: hashPassword(password, salt),salt })
        if (!newUser) {
            throw new Error('some error occured creating the new user')
        }

        return newUser
    } catch (err) {
        console.log('Error Catch User not created')
        throw err
    }
}

const registeredUser = async (userId) =>{
    try{
        const user = await userModel.findOne({_id: userId})
        return user
    }catch(err){
        console.log('Error something went wrong getting users')
    }
}

export const userDomain = {
    authenticateUser,
    createUser,
    registeredUser
}