import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  await db.run("DELETE FROM staff WHERE id = ?", [id]);
  return NextResponse.json({ message: "Deleted" });
}
