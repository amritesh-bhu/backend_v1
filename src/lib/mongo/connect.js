import { mongoose } from "mongoose";

export const connectMongo = async (url) => {
    try {
        const connection = await mongoose.connect(url)
        // console.log(connection)
        console.log(`connected to mongo database successfully`)
        return connection
    } catch (err) {
        throw new Error(`failed to connect databse at ${url}`)
    }
}

