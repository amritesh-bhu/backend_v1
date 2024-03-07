import { rbacDomain } from "../domain/rbac/index.js"
import { checkingUser } from "../lib/middlewares/function.js"
import { handleRoute } from "../lib/middlewares/handle-route.js"

export const rbacRouter = (basepath, app) => {
    app.get(`${basepath}/action`,handleRoute(checkingUser), handleRoute(async (req, res) => {
        const { email } = req
        const { _id, action } = req.body
        const result = await rbacDomain.canI({ email, _id, action })
        // console.log(result)
        res.send({ msg: result })
    }))

    app.post(`${basepath}/bindme`, handleRoute(async (req, res) => {
        const { email, resourceId, action, resource } = req.body
        console.log(email, resourceId, action, resource)
        const binding = await rbacDomain.addRoleBinding({ email, resourceId, action, resource })
        res.json(binding)
    }))

    app.get(`${basepath}/sharedtodos`, handleRoute(async (req, res) => {
        const { email } = req
        console.log(email)
        const resources = await rbacDomain.listResources({ email })
        if (!resources) {
            res.json({ msg: "No shared resources" })
        }
        res.json(resources)
    }))

    app.delete(`${basepath}/:id`, handleRoute(async (req, res) => {
        const id = req.params.id
        console.log(id)
        const items = await rbacDomain.deleteTodo(id)
        res.json(items)
    }))

    // app.put(`${basepath}/rbacedit`, handleRoute(async (req, res) => {
    //     const { resourceId, resource } = req.body
    //     const resources = await rbacDomain.editTodo({ resourceId, resource })
    //     res.json(resources)
    // }))
} 