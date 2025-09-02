const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('chat');
    const collection = db.collection('messages');
    const messages = await collection.find().sort({ timestamp: -1 }).limit(50).toArray();
    return { statusCode: 200, body: JSON.stringify(messages) };
  } catch (err) {
    return { statusCode: 500, body: 'Database error' };
  } finally {
    await client.close();
  }
};