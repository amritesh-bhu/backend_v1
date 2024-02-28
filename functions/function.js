import { redisSession } from "../domain/redis-session.js"
import { userDomain } from "../domain/users.js"

export const handleRoute = (asyncFunc) => {
    return (req, res, next) => {
        (async () => {
            try {
                await asyncFunc(req, res, next)
            } catch (err) {
                next(err)
            }
        })()
    }
}

export const handleUserAccess = async (req,res,next) =>{
    const user = await userDomain.registeredUser(req.body.userId)
    console.log(user)
    // const 
    next()
}

export async function rateLimit(sessionId,session) {
    // does what it needs to do
    const {userId,reqCount} = JSON.parse(session) 
    if ( reqCount >= 100) {
        console.log("rate limit ",reqCount)
        return true
    }
    const newCount = reqCount + 1
    const userSession = await redisSession.updateSession(sessionId,userId,newCount)
    console.log("rate limit ",userSession)
    return false
}