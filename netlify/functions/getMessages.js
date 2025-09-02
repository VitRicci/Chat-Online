const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  console.log("Function getMessages called");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db('chat');
    const collection = db.collection('messages');
    const messages = await collection.find().sort({ timestamp: -1 }).limit(50).toArray();
    await client.close();
    console.log("Returning messages:", messages.length);
    return { statusCode: 200, body: JSON.stringify(messages) };
  } catch (err) {
    console.log("Error in getMessages:", err.message);
    return { statusCode: 200, body: JSON.stringify([]) };
  }
};

async function getMessages() {
  const res = await fetch('/.netlify/functions/getMessages');
  if (!res.ok) return [];
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}