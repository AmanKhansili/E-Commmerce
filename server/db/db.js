import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDb is conected || ${connection.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export default ConnectDB;
