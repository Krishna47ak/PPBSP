import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Detection from '@/models/Detection';

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
    return NextResponse.json({ success: true, data: detections });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 