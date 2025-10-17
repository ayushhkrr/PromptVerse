import mongoose from 'mongoose'

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Sucessfully connected to MongoDB");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default connectdb
