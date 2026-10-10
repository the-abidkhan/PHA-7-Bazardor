import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing from .env.local");
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // 개발 모드 (Development)
    if (!(global as any)._mongoClient) {
        client = new MongoClient(uri, options);
        (global as any)._mongoClient = client;
    }
    client = (global as any)._mongoClient;
} else {
    // প্রোডাকশন মোড (Production)
    client = new MongoClient(uri, options);
}

export { client };