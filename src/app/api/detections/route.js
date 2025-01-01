import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Detection from '@/models/Detection';
import CryptoJS from 'crypto-js';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const detection = await Detection.create(data);
    return NextResponse.json({ success: true, data: detection }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const detections = await Detection.find({}).sort({ timestamp: -1 });

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(detections),
      process.env.ENCRYPTION_KEY || 'default_encryption_key'
    ).toString();

    return NextResponse.json({ success: true, data: encryptedData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 