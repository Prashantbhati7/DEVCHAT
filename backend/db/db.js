import mongoose from "mongoose";


function connect() {
    console.log("Connecting to MongoDB",process.env.MONGODB_URI)
    mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(err => {
            console.log(err);
        })
}

export default connect;