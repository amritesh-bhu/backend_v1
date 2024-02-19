import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    value: { type: String, required: true }
})

const todosModel = new mongoose.model('todos', todoSchema)

// const convertId = (id) =>{
//     const _id =  new mongoose.Types.ObjectId(id)
//     return _id
// }

const getTodos = async ({ userId }) => {
    const todos = await todosModel.find({ userId })
    if (!todos) {
        throw new Error('todos with this user does not exist')
    }
    return todos
}

const addNewTodo = async ({ userId, value }) => {
    const newTodo = await todosModel.create({ userId, value })
    if (!newTodo) {
        throw new Error('Couldn\'t add new todo to your list')
    }
    return getTodos({ userId: newTodo.userId })
}

const editTodo = async ({ _id, value }) => {
    
    // const id = convertId(_id)
    // console.log("from edit todo",id)

    const item = await todosModel.findOne({ _id: _id })
    
    if (!item) {
        throw new Error('todos with this id does not exist')
    }

    await todosModel.updateOne({ _id: _id }, { $set: { value: value } })

    return getTodos({ userId: item.userId })
}

const deleteTodo = async (id) => {
    
    // const id = convertId(_id)

    const item = await todosModel.findOne({ _id: id }) 
    if (!item) {
        throw new Error('todos with this id doies not exist')
    }

    await todosModel.deleteOne({ _id: id })

    return getTodos({ userId: item.userId })
}


export const todosDomain = {
    getTodos,
    addNewTodo,
    editTodo,
    deleteTodo
}


