import { todosDomain } from "../domain/todos-domain.js"
import { handleRoute } from "../functions/function.js"

export const todosRouter = (basepath, app) => {
    app.get(basepath, handleRoute(async (req, res) => {

        const { userId } = req.body
        const todos = await todosDomain.getTodos({ userId })

        res.json(todos)
    }))

    app.post(`${basepath}/newtodo`, handleRoute(async (req, res) => {

        const { userId, value } = req.body

        console.log(userId, value)
        const items = await todosDomain.addNewTodo({ userId, value })

        res.json(items)
    }))

    app.put(`${basepath}/edittodo`, handleRoute(async (req, res) => {

        const { _id, value } = req.body
        console.log("from edit route",req.body)
        const item = await todosDomain.editTodo({ _id, value })

        res.json(item)
    }))

    app.delete(`${basepath}/:id`, handleRoute(async (req, res) => {
        console.log("from delete route", req.params.id)
        const todos = await todosDomain.deleteTodo(req.params.id)

        res.json(todos)
    }))
}