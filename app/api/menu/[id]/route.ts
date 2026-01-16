import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const { name, category, price, description, image } = await request.json();
    const db = await getDb();
    await db.run(
        "UPDATE menu_items SET name = ?, category = ?, price = ?, description = ?, image = ? WHERE id = ?", 
        [name, category, price, description, image, id]
    );
    return NextResponse.json({ id, name, category, price, description, image });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const db = await getDb();
        await db.run("DELETE FROM menu_items WHERE id = ?", [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
