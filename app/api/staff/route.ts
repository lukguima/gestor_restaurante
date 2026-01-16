import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all("SELECT * FROM staff");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, name, role, pin } = await request.json();
    const db = await getDb();
    await db.run("INSERT INTO staff (id, name, role, pin) VALUES (?, ?, ?, ?)", [id, name, role, pin]);
    return NextResponse.json({ id, name, role, pin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const db = await getDb();
        await db.run("DELETE FROM staff WHERE id = ?", [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
