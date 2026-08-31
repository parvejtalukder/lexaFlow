import { COLLECTIONS, getCollection } from '@/lib/collections';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
  try {
    const body = await request.json();
    const {
      uid,
      fullName,
      phone,
      address,
      jobTitle,
      registrationNumber,
      idCardUrl,
      licenseDocUrl,
    } = body;

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing user identifier (uid).' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection(COLLECTIONS.USERS);
    const filesCollection = await getCollection(COLLECTIONS.FILES);

    const userUpdateResult = await usersCollection.updateOne(
      { uid },
      {
        $set: {
          fullName,
          phone,
          address,
          jobTitle,
          registrationNumber,
          accountStatus: 'PENDING',
          updatedAt: new Date(),
        },
      }
    );

    if (userUpdateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User record not found.' },
        { status: 404 }
      );
    }
    
    const fileRecords = [];

    if (idCardUrl) {
      fileRecords.push({
        uid,
        fileType: 'GOVERNMENT_ID',
        filePath: idCardUrl,
        uploadedAt: new Date(),
      });
    }

    if (licenseDocUrl) {
      fileRecords.push({
        uid,
        fileType: 'PRACTICE_LICENSE',
        filePath: licenseDocUrl,
        uploadedAt: new Date(),
      });
    }

    if (fileRecords.length > 0) {
      await filesCollection.insertMany(fileRecords);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Caseworker application submitted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Application Update API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process application update on the server.' },
      { status: 500 }
    );
  }
}