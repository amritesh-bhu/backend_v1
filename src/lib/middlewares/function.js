// import { redisSession } from "../domain/redis-session.js"
import { sessionDomain } from "../../domain/session/index.js"
import { SESSION_NAME } from "../../env/env.js"

// export const handleUserAccess = async (req,res,next) =>{
//     const user = await userDomain.registeredUser(req.body.userId)
//     console.log(user)
//     // const 
//     next()
// }

export const checkingUser = async (req,res,next) =>{
    const sessionId = await req.cookies[SESSION_NAME]
    const userId = await sessionDomain.getSession(sessionId)
    console.log(req.body.userId,JSON.parse(userId).userId)
    if (req.body.userId == JSON.parse(userId).userId){
        res.json({msg:"ok"})
        return
    }
    next()
}

// export async function rateLimit(sessionId,session) {
//     // does what it needs to do
//     const {userId,reqCount} = JSON.parse(session) 
//     if ( reqCount >= 100) {
//         console.log("rate limit ",reqCount)
//         return true
//     }
//     const newCount = reqCount + 1
//     const userSession = await redisSession.updateSession(sessionId,userId,newCount)
//     console.log("rate limit ",userSession)
//     return false
// }
