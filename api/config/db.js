const mongoose = require("mongoose");
const config = require('./../config');

const connectDB = async () => {
  try {
    const uri = `${config.databaseUrl}/${config.databaseName}` || "mongodb://127.0.0.1:27017/schedule";
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    const connection = mongoose.connection;
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;
