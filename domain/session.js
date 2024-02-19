/* eslint-disable no-useless-catch */
import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    userId: { type: String }
})

const sessionModel = new mongoose.model('sessions', sessionSchema)


const createSession = async (userId) => {
    try {
        const session = await sessionModel.create({ userId })
        return session
    } catch (err) {
        throw err
    }
}

const getSession = async (sessionId) => {
    try {
        const session = await sessionModel.findOne({_id: sessionId })
        return session
    } catch (err) {
        throw err
    }
}

const deleteSession = async (sessionId) => {
    try {
        const session = await sessionModel.deleteOne({ _id: sessionId })
        return session
    } catch (err) {
        throw err
    }
}

export const userSession = {
    createSession,
    getSession,
    deleteSession
}