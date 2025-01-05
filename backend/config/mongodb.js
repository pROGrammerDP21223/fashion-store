import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB Connected');
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URL}fashion-store`, {
            authSource: 'admin'
        });
    } catch (error) {
        console.error('Connection error: ', error);
    }
};

export default connectDB;
