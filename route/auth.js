/* eslint-disable no-unused-vars */
import { nanoid } from "nanoid"
import { redisSession } from "../domain/redis-session.js"
import { userSession } from "../domain/session.js"
import { userDomain } from "../domain/users.js"
import { SESSION_NAME } from "../env/env.js"
import { handleRoute } from "../functions/function.js"
import { sessionCheck } from "../session-check/sessionCheck.js"

export const authenticateuser = (basepath, app) => {

    app.get(`${basepath}/me`,handleRoute(sessionCheck),handleRoute(async (req, res) => {
        console.log(req.userId)
        if(!req.userId){
            res.status(401).send({msg:"Please login"})
        }
        res.send({msg:"already logged in"})
    }))

    app.delete(`${basepath}/logout`,handleRoute(async (req,res) =>{
        // console.log(req.userId)
        const sessionId = req.cookies[SESSION_NAME]
        // console.log("from delete logout route ",sessionId)
        // const destroySession = await userSession.deleteSession(sessionId)
        const destroySession = await redisSession.deleteSession(sessionId)
        // res.cookie(SESSION_NAME, 'None', { secure: true, httpOnly: true, sameSite: 'None', expires: new Date(Date.now() + 5 * 1000) })
        res.clearCookie(SESSION_NAME)
        res.json({ msg: "you have been logged out" })
    }))

    app.post(`${basepath}/login`, handleRoute(async (req, res) => {
        const { username, password } = req.body
        req.count = 0
        // console.log("req count ", req.count)
        const user = await userDomain.authenticateUser({username, password})
        // console.log("from auth login : ", user)
        // const session = await userSession.createSession(user._id)
        const session = await redisSession.createSession(user._id.toString(),req.count)
        // console.log(session)
        res.cookie(SESSION_NAME,session,{httpOnly:true,secure:true,sameSite:'None'})
        res.json(user)
    }))

    app.post(`${basepath}/signup`, handleRoute(async (req, res) => {
        const { username, password } = req.body
        const new_user = await userDomain.createUser(username, password)
        res.json(new_user)
    }))
}