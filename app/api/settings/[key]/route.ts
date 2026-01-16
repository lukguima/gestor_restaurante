import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const db = await getDb();
  const row = await db.get("SELECT value FROM settings WHERE key = ?", [key]);
  return NextResponse.json({ value: row ? JSON.parse(row.value) : null });
}

export async function POST(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const { value } = await req.json();
  const db = await getDb();
  await db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, JSON.stringify(value)]);
  return NextResponse.json({ key, value });
}
