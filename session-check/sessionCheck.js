import { userSession } from "../domain/session.js"
import { SESSION_NAME } from "../env/env.js"

export const sessionCheck = async (req,res,next) =>{

    const sessionId = req.cookies[SESSION_NAME]
    const session = await userSession.getSession(sessionId)

    console.log("session id: ",sessionId)
    console.log("session userId : ",session)

    if(!session){
        console.log("no session found")
        res.status(401).send({msg:"Unauthorised user, please login"})
    }

    req.sessionId = session._id
    req.body.userId = session.userId

    console.log("session check",req.body)
    
    next()

}