import { todosDomain } from "../domain/todos/index.js";
import { handleRoute } from "../lib/middlewares/handle-route.js";

export const todosRouter = (basepath, app) => {
    app.get(basepath, handleRoute(async (req, res) => {

        const { userId } = req.body
        const todos = await todosDomain.getTodos({userId})

        res.json(todos)
    }))

    app.post(`${basepath}/sharedid`, handleRoute(async (req,res) =>{
        const {ids} = req.body
        console.log('ids',ids)
        const todos = await todosDomain.getTodosById({ids})
        // console.log(todos)
        res.json(todos)
    }))

    app.post(`${basepath}/newtodo`, handleRoute(async (req, res) => {

        const { userId, value } = req.body

        console.log(userId, value)
        const items = await todosDomain.addNewTodo({ userId, value })
        res.json(items)
    }))

    app.put(`${basepath}/edittodo`, handleRoute(async (req, res) => {

        const { _id,userId, value } = req.body
        console.log("from edit route",req.body)
        const item = await todosDomain.editTodo({ _id,userId, value })

        res.json(item)
    }))

    app.delete(`${basepath}/:id`, handleRoute(async (req, res) => {
        console.log("from delete route", req.params.id)
        const {userId} = req.body
        const id = req.params.id
        const todos = await todosDomain.deleteTodo({id,userId})

        res.json(todos)
    }))
}
