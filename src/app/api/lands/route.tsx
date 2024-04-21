import { getLands } from '~/server/lands'; 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) { 
  console.log("Request method api/lands:"); 

  try {
    const lands = await getLands();
    return NextResponse.json(lands);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching lands data" });
  }
}

