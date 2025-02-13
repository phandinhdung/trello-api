/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

//phandinhdung
//phandinhdung270190
//npm install mongodb@5.5

import { env } from '~/config/environment';
import { MongoClient, ServerApiVersion } from 'mongodb';

//Khởi tạo một đối tượng trelloDatabaseInstance là null, vì chưa connect
let trelloDatabaseInstance = null;

// Khởi tạo một đối tượng client Instance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!');
  return trelloDatabaseInstance;
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
}