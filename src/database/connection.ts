import mongoose, { ConnectOptions }from 'mongoose';


export const connectDB = async () => {
    const option = {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URI||'', option as ConnectOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
    }

}

export const  closeDB = async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.log(error)
    }
}