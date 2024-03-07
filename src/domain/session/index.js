/* eslint-disable no-useless-catch */
import { createClient } from 'redis';
// import { redisManager } from '../data-manager/redis-conn.js';
import { nanoid } from 'nanoid';

const client = createClient()
client.on('error', err => console.log('Redis Client Error', err))
await client.connect()
console.log('connected to redis')

// const client = redisManager()

const createSession = async (userId,count) => {
    try {
        console.log("redis creating session",userId,count)
        const userSession = nanoid(32)
        await client.set(userSession ,JSON.stringify({"userId" : userId, "reqCount" : count }), (err,data) => {
            if (err) {
                console.error(err)
            }
            console.log("creating session ",data)
        })
        // console.log('creating session : ', session)
        return userSession

    } catch (err) {
        throw err;
    }
}

const getSession = async (sessionId) => {
    try {
        const session = await client.get(sessionId,(err) =>{
            if(err){
                console.error(err)
            }
        })
        console.log("get redis hey", session)
        return session
    } catch (err) {
        throw err;
    }
}

const deleteSession = async (sessionId) => {
    try {
        const session = await client.del(sessionId)
        return session
    } catch (err) {
        throw err;
    }
}

const updateSession = async (sessionId,userId,count) =>{
    try {
        const session = await client.set(sessionId,JSON.stringify({"userId":userId,reqCount : count}),(err) =>{
            console.error(err)
        })
        return session
    } catch (err) {
        throw err;
    }
}

export const sessionDomain = {
    createSession,
    getSession,
    deleteSession,
    updateSession
}
