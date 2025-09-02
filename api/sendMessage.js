let messages = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    messages.push({ name, email, message, timestamp: Date.now() });
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}