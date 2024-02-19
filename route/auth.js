/* eslint-disable no-unused-vars */
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

    app.delete(`${basepath}/logout`,handleRoute(sessionCheck),handleRoute(async (req,res) =>{
        console.log(req.userId)
        const sessionId = req.sessionId
        const destroySession = await userSession.deleteSession(sessionId)
        // res.cookie(SESSION_NAME, 'None', { secure: true, httpOnly: true, sameSite: 'None', expires: new Date(Date.now() + 5 * 1000) })
        res.clearCookie(SESSION_NAME)
        res.json({ msg: "you have been loged out" })
    }))

    app.post(`${basepath}/login`, handleRoute(async (req, res) => {
        const { username, password } = req.body
        const user = await userDomain.authenticateUser({username, password})
        const session = await userSession.createSession(user._id)
        res.cookie(SESSION_NAME,session._id.toString(),{httpOnly:true,secure:true,sameSite:'None'})
        res.json(user)
    }))

    app.post(`${basepath}/signup`, handleRoute(async (req, res) => {
        const { username, password } = req.body
        const new_user = await userDomain.createUser(username, password)
        res.json(new_user)
    }))
}