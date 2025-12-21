const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Khushal_Saini:7f8lIFZ46RRxHH6Q@khushmongodb.u0pvso1.mongodb.net/devTinder"
    );
}
module.exports = connectDB;