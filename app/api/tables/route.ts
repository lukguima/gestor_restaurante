import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all("SELECT * FROM tables");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, name, seats } = await request.json();
    const db = await getDb();
    await db.run("INSERT INTO tables (id, name, seats) VALUES (?, ?, ?)", [id, name, seats]);
    return NextResponse.json({ id, name, seats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const { id, name, seats } = await request.json();
        const db = await getDb();
        await db.run("UPDATE tables SET name = ?, seats = ? WHERE id = ?", [name, seats, id]);
        return NextResponse.json({ id, name, seats });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Extract ID from URL if possible, or body. Next.js App Router uses `params` in dynamic routes, 
        // but for simplicity in a single file route, we might need a dynamic route `[id]`.
        // For now, let's assume body or query param for DELETE in this simple setup, 
        // OR better: use dynamic route structure `app/api/tables/[id]/route.ts`.
        // To save time, I will just accept ID in the body for now, although not standard REST.
        // Actually, let's just use body for simplicity as I did in other routes? 
        // Wait, other routes used dynamic routes?
        // Let's check `app/api/menu/route.ts` (it wasn't shown fully but I likely used dynamic routes).
        // If I use a single file `route.ts`, I can't easily handle `DELETE /api/tables/1`.
        // I'll use `DELETE` with body `{ id }` for now to avoid creating folder structures for every ID.
        
        const { id } = await request.json();
        const db = await getDb();
        await db.run("DELETE FROM tables WHERE id = ?", [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
