import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.DATABASE_URL;
const options: MongoClientOptions = {};

interface GlobalMongo {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

let cached: GlobalMongo = {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV === 'development') {
  if (!(global as any).mongo) {
    (global as any).mongo = cached;
  }
  cached = (global as any).mongo;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(uri, options);
  }
  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB; 