import { COLLECTIONS, getCollection } from '@/lib/collections';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, fullName, email, photoURL } = body;

    if (!uid || !email || !fullName) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: uid, email, and fullName are required.' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection(COLLECTIONS.USERS);

    const existingUser = await usersCollection.findOne({ uid });
    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          message: 'User profile already exists in MongoDB.',
          insertedId: existingUser._id,
        },
        { status: 200 }
      );
    }

    const newUserDoc = {
      uid,
      fullName,
      photoURL: photoURL || null,
      email: email.toLowerCase(),
      address: '',
      phone: '',
      jobTitle: '',
      registrationNumber: '',
      staffId: '',
      role: 'caseworker', 
      accountStatus: 'PENDING', 
      joiningDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUserDoc);

    return NextResponse.json(
      {
        success: true,
        insertedId: result.insertedId,
        message: 'Application registered successfully. Pending Admin review.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign-Up API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user record on the server.' },
      { status: 500 }
    );
  }
}