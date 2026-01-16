import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { listOrders, normalizeItemsAndTotal } from "@/lib/db-actions"

export async function GET() {
  try {
    const orders = await listOrders()
    return NextResponse.json(orders)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      id = Date.now().toString(),
      table_number, 
      items,
      status = 'pending', 
      name = `Mesa ${table_number}`,
      type = 'dine-in',
      payment_method,
      waiter_name,
    } = body

    if (!table_number || Number.isNaN(Number(table_number))) {
      return NextResponse.json(
        { error: "Número da mesa inválido" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const { items: normalizedItems, total } = await normalizeItemsAndTotal(items)

    const sql = `
      INSERT INTO orders (
        id,
        name,
        table_number,
        items,
        status,
        type,
        value,
        date,
        payment_method,
        waiter_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const date = new Date().toISOString()
    
    await db.run(sql, [
      id, 
      name, 
      table_number, 
      JSON.stringify(normalizedItems), 
      status, 
      type, 
      total,
      date,
      payment_method ?? null,
      waiter_name ?? null,
    ])
    
    return NextResponse.json({
      id,
      name,
      table_number,
      items: normalizedItems,
      status,
      type,
      total,
      date,
      payment_method,
      waiter_name,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
    try {
        // We need to parse the URL to get the ID if we are using dynamic routes, 
        // but this file is `app/api/orders/route.ts` which handles `/api/orders`.
        // To handle `/api/orders/[id]`, we should have created `app/api/orders/[id]/route.ts`.
        // My KitchenBoard calls `api.put('/orders/${orderId}', ...)`
        // This means it expects `/api/orders/123`.
        // Currently, `app/api/orders/route.ts` ONLY handles `/api/orders`.
        // It does NOT handle `/api/orders/123`.
        
        // CRITICAL FIX: I need to move this logic to `app/api/orders/[id]/route.ts` OR
        // change the frontend to call `PUT /api/orders` with `{ id, ... }`.
        
        // Changing the frontend is easier if I didn't want to create folders.
        // But `KitchenBoard` is already written to use RESTful ID in URL: `api.put(/orders/${orderId}, ...)`.
        // So I MUST create `app/api/orders/[id]/route.ts`.
        
        // However, I can also handle it here if I check the URL, but Next.js App Router separates them.
        // So I will create `app/api/orders/[id]/route.ts` for PUT/DELETE/GET-one.
        
        // Wait, for `POST` (create), it stays in `route.ts`.
        // For `GET` (list), it stays in `route.ts`.
        
        return NextResponse.json({ error: "Method not allowed on collection. Use /api/orders/[id]" }, { status: 405 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
