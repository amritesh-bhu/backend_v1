import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: { type: String, required: true },
    resourceId: { type: String, required: true },
    action: { type: Array, required: true }
});

const rbacModel = mongoose.model("rbac", schema)


const canI = async ({ email, _id, action }) => {
    // TODO: returns whether `email` can perform `action` on resource `resourceId`
    const record = await rbacModel.findOne({ email, resourceId: _id, action })
    return record != null
}

const listResources = async ({ email }) => {
    return await rbacModel.find({ email: email })
}

const addRoleBinding = async ({ email, resourceId, action }) => {
    // TODO: create a database entry guaranteeing `email` permission to perform `action` on `resourceId`
    return await rbacModel.create({ email, resourceId, action });
};

const deleteTodo = async (id) => {
    const ele = await rbacModel.findOne({ resourceId: id })
    console.log(ele)
    if (!ele) {
        throw new Error("you con not perform this action")
    }
    const item = await rbacModel.deleteOne({ resourceId: id })
    console.log(item)
    return await rbacModel.find({ email: ele.email })
}

// const editTodo = async ({ resourceId, resource }) => {
//     const ele = await rbacModel.findOne({ resourceId })
//     console.log(ele)
//     if (!ele) {
//         throw new Error("you con not perform this action")
//     }
//     const item = await rbacModel.updateOne({ resourceId }, { $set: { resource: resource } })
//     console.log(item)
//     return await rbacModel.find({ email: ele.email })
// }

export const rbacDomain = {
    canI,
    listResources,
    addRoleBinding,
    deleteTodo
    // editTodo
};