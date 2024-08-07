import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/project-todo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB database is connected');
  } catch (error) {
    console.log('MongoDB database connection failed');
  }
};

export default connectDB;
