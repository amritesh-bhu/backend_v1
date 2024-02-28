/* eslint-disable no-useless-catch */
import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    userId: { type: String }
})

const sessionModel = new mongoose.model('sessions', sessionSchema)


const createSession = async (userId) => {
    return sessionModel.create({ userId });
}

const getSession = async (sessionId) => {
    return sessionModel.findOne({_id: sessionId })
}

const deleteSession = async (sessionId) => {
    return sessionModel.deleteOne({ _id: sessionId })
}

export const userSession = {
    createSession,
    getSession,
    deleteSession
}
