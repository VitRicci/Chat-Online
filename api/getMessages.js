import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('chat');
    const collection = db.collection('messages');
    const messages = await collection.find().sort({ timestamp: -1 }).limit(50).toArray();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.close();
  }
}