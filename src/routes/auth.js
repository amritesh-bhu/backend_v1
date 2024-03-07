import { userDomain } from "../domain/user/index.js"
import { sessionDomain } from "../domain/session/index.js";
import { SESSION_NAME } from "../env/env.js"
import { handleRoute } from "../lib/middlewares/handle-route.js";
import { checkSession } from "../domain/session/middleware.js";

export const authenticateuser = (basepath, app) => {
    app.get(`${basepath}/me`,handleRoute(checkSession),handleRoute(async (req, res) => {
        console.log(req.userId)
        if(!req.userId){
            res.status(401).send({msg:"Please login"})
        }
        res.send({msg:"already logged in"})
    }))

    app.delete(`${basepath}/logout`,handleRoute(async (req,res) =>{
        const sessionId = req.cookies[SESSION_NAME]
        await sessionDomain.deleteSession(sessionId)
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
        const session = await sessionDomain.createSession(user._id.toString(),req.count)
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
