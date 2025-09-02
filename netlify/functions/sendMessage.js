const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  console.log("Function sendMessage called");
  if (event.httpMethod !== 'POST') {
    console.log("Method not allowed");
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    console.log("Parsing event body");
    const { name, email, message } = JSON.parse(event.body);
    console.log("Connecting to MongoDB");
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db('chat');
    const collection = db.collection('messages');
    console.log("Inserting message");
    await collection.insertOne({ name, email, message, timestamp: Date.now() });
    await client.close();
    console.log("Message inserted and connection closed");
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.log("Error in sendMessage:", err.message);
    return { statusCode: 500, body: 'Database error: ' + err.message };
  }
};