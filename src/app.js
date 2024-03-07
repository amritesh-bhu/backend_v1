import express from 'express';
import cors from "cors"
import { HTTP_PORT, MONGO_URL } from "./env/env.js"
import { authenticateuser } from "./routes/auth.js"
import cookieParser from 'cookie-parser';
import { todosRouter } from './routes/todos.js';
import { handleRoute } from './lib/middlewares/handle-route.js';
import { checkSession } from './domain/session/middleware.js';
import { connectMongo } from './lib/mongo/connect.js';
import { rbacRouter } from './routes/rbac.js';

// pre-requisites for app
// 1. mongo
connectMongo(MONGO_URL)

// TODO (redis client)

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: /http:\/\/(localhost|127.0.0.1):*/,
        credentials: true
    })
)

authenticateuser("/auth", app)

app.use(handleRoute(checkSession))

todosRouter('/todos',app)
rbacRouter('/rbac',app)

app.use((err, req, res, next) => {
    res.status(500).json({'error': err.message});
    next();
}); 


app.listen(HTTP_PORT, (err) => {
    if (err) {
        console.log("error occur while starting the port : ", err)
    }
    console.log(`Server is listening at port ${HTTP_PORT}`)
})

