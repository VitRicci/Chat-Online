import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    try {
      await client.connect();
      const db = client.db('chat');
      const collection = db.collection('messages');
      await collection.insertOne({ name, email, message, timestamp: Date.now() });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}