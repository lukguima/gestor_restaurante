import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  const rows = await db.all("SELECT * FROM menu_items");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { id, name, category, price, description, image } = await req.json();
  const db = await getDb();
  await db.run("INSERT INTO menu_items (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)", [id, name, category, price, description, image]);
  return NextResponse.json({ id, name, category, price, description, image });
}
