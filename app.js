import express from 'express';
import cors from "cors"
import { manager } from "./data-manager/manager.js"
import { HTTP_PORT, MONGO_URL } from "./env/env.js"
import { authenticateuser } from "./route/auth.js"
import cookieParser from 'cookie-parser';
import { handleRoute } from './functions/function.js';
import { sessionCheck } from './session-check/sessionCheck.js';
import { todosRouter } from './route/todos.js';

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: /http:\/\/(localhost|127.0.0.1):*/,
        credentials: true
    })
)

manager(MONGO_URL)
authenticateuser("/auth", app)

app.use(handleRoute(sessionCheck))

todosRouter('/todos',app)

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

