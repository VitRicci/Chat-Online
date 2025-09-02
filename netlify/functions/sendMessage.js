const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { name, email, message } = JSON.parse(event.body);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('chat');
    const collection = db.collection('messages');
    await collection.insertOne({ name, email, message, timestamp: Date.now() });
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: 'Database error' };
  } finally {
    await client.close();
  }
};