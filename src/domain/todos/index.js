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

const getTodos = async ({userId}) => {
    const todos = await todosModel.find({userId})
    if (!todos) {
        throw new Error('todos with this user does not exist')
    }
    return todos
}

const getTodosById = async ({ids}) =>{
    const objectids = ids.map((id)=>{
        return new mongoose.Types.ObjectId(id)
    }) 
    const todos = await todosModel.find({_id: {$in :objectids}})
    if (!todos) {
        throw new Error('some error occured')
    }
    return todos
}

const addNewTodo = async ({ userId, value }) => {
    const newTodo = await todosModel.create({ userId, value })
    // console.log("adding new todo",newTodo)
    if (!newTodo) {
        throw new Error('Couldn\'t add new todo to your list')
    }
    return getTodos({userId})
}

const editTodo = async ({ _id,userId, value }) => {
    
    // const id = convertId(_id)
    // console.log("from edit todo",id)

    const       item = await todosModel.findOne({ _id: _id })
    
    if (!item) {
        throw new Error('todos with this id does not exist')
    }

    await todosModel.updateOne({ _id: _id }, { $set: { value: value } })

    return getTodos({userId})
}

const deleteTodo = async ({id,userId}) => {
    
    // const id = convertId(_id)

    const item = await todosModel.findOne({ _id: id }) 
    if (!item) {
        throw new Error('todos with this id doies not exist')
    }

    await todosModel.deleteOne({ _id: id })

    return getTodos({userId})
}


export const todosDomain = {
    getTodos,
    addNewTodo,
    editTodo,
    deleteTodo,
    getTodosById
}


