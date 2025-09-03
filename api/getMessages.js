import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('chat');
    const collection = db.collection('messages');
    const messages = await collection.find().sort({ timestamp: -1 }).limit(50).toArray();
    await client.close();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json([]);
  }
}