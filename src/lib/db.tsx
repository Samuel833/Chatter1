import mongoose from "mongoose";

let client: mongoose.Connection ;
let bucket: mongoose.mongo.GridFSBucket;


async function connectToMongoDB() {
    if (client) {
        return { client, bucket };
    }

    await mongoose.connect(process.env.MONGODB_URL as string);

    client = mongoose.connection;

    // use mongoose connection
    const db = mongoose.connection;
    bucket = new mongoose.mongo.GridFSBucket(db.db, {
        bucketName: "images",
    });

    console.log("Connected to the Database");
    return { client, bucket };
}

export default connectToMongoDB;
