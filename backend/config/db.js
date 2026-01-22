import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongodada = process.env.MONGO_URI
export const connectdb = async () => {
    await mongoose.connect(mongodada, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
        .then(() => console.log('DB Done'))
        .catch((err) => console.error('gadbad in db', err))
}