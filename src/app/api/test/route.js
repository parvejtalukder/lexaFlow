import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // 1. Get MongoClient instance
    const client = await clientPromise;
    
    // 2. Ping MongoDB admin database
    const adminDb = client.db().admin();
    const pingResult = await adminDb.ping();
    
    const latency = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'online',
        message: 'MongoDB connection successful! 🚀',
        latency: `${latency}ms`,
        ping: pingResult,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('MongoDB Ping Error:', error);
    
    return NextResponse.json(
      {
        status: 'offline',
        error: 'Failed to connect to MongoDB',
        message: error.message,
        code: error.code || error.cause?.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}