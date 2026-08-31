import { COLLECTIONS, getCollection } from "@/lib/collections";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing UID!' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection(COLLECTIONS.USERS);
    const user = await usersCollection.findOne({ uid });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        role: user.role,
        accountStatus: user.accountStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Role API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user record on the server.' },
      { status: 500 }
    );
  }
}