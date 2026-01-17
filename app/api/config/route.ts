import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all("SELECT * FROM settings");
    // Convert to object { key: value }
    const settings: any = {};
    rows.forEach((row: any) => {
        try {
            settings[row.key] = JSON.parse(row.value);
        } catch {
            settings[row.key] = row.value;
        }
    });
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    // Body should be { key: value }
    for (const [key, value] of Object.entries(body)) {
      await db.run(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value",
        [key, JSON.stringify(value)]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
