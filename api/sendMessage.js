import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    const { name, email, message } = req.body;
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('chat');
    const collection = db.collection('messages');
    await collection.insertOne({ name, email, message, timestamp: Date.now() });
    await client.close();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
}