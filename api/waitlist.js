const { MongoClient } = require('mongodb');

// Connection pooling across serverless invocations
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('Please define the MONGO_URI environment variable');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    connectTimeoutMS: 10000,
  });

  // Extract DB name from URI or fallback to 'kibitzz'
  const db = client.db();

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const email = body ? body.email : null;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const { db } = await connectToDatabase();
    // Default to 'kibitzz' database if not specified in URI
    const targetDb = db.databaseName && db.databaseName !== 'test' ? db : db.client.db('kibitzz');
    const collection = targetDb.collection('ios_wait_list');

    const cleanEmail = String(email).trim().toLowerCase();

    // Ensure unique index on email
    await collection.createIndex({ email: 1 }, { unique: true }).catch(() => { });

    // Insert or ignore if duplicate
    const result = await collection.updateOne(
      { email: cleanEmail },
      {
        $setOnInsert: {
          email: cleanEmail,
          createdAt: new Date(),
          source: 'ios_waitlist'
        }
      },
      { upsert: true }
    );

    const isNew = result.upsertedCount > 0;

    return res.status(200).json({
      success: true,
      message: isNew
        ? "You're on the list! We'll notify you when the app is live on iOS."
        : "You are already registered on the waitlist!"
    });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process waitlist request. Please try again later.',
      details: String(error)
    });
  }
};
