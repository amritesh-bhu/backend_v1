import { redisSession } from "../domain/redis-session.js"
// import { userSession } from "../domain/session.js"
import { SESSION_NAME } from "../env/env.js"
import { rateLimit } from "../functions/function.js"

export const sessionCheck = async (req,res,next) =>{

    // console.log("hi")
    const sessionId = req.cookies[SESSION_NAME]
    console.log("session check", sessionId)
    // const session = await userSession.getSession(sessionId)
    const session = await redisSession.getSession(sessionId)

    console.log("session id: ",sessionId)
    console.log("session : ",JSON.parse(session))

    if(!session){
        console.log("no session found")
        res.status(401).send({msg:"Unauthorised user, please login"})
    }

    req.sessionId = sessionId
    req.body.userId = JSON.parse(session).userId

    if (await rateLimit(sessionId,session)) {
        
        res.status(429).send({msg: "you crossed your requests limits. Bye Bye"})
        
    }


    console.log("session check",req.body)
    
    next()

}