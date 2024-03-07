import { SESSION_NAME } from "../../env/env.js"
import { userDomain } from "../user/index.js"
import { sessionDomain } from "./index.js"

export const checkSession = async (req,res,next) =>{
    const sessionId = req.cookies[SESSION_NAME]
    const session = await sessionDomain.getSession(sessionId)
    const user = await userDomain.registeredUser(JSON.parse(session).userId)
    console.log("user",user)
    if(!session){
        res.status(401).send({msg:"Unauthorised user, please login"})
    }

    req.sessionId = sessionId
    req.body.userId = JSON.parse(session).userId
    req.email = user.username
    next()
}
