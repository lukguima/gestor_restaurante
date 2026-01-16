import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getOrderById, normalizeItemsAndTotal } from "@/lib/db-actions"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const db = await getDb()

    const current = await getOrderById(id)
    if (!current) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    const requestWaiterName = body.waiter_name as string | undefined
    if (current.waiter_name && requestWaiterName && current.waiter_name !== requestWaiterName) {
      return NextResponse.json(
        { error: "Mesa pertence a outro garçom" },
        { status: 403 }
      )
    }
    
    const updates: string[] = []
    const values: any[] = []

    if (body.status !== undefined) {
      updates.push("status = ?")
      values.push(body.status)
    }
    
    let normalizedItemsForSave: any[] | null = null
    if (body.items !== undefined) {
      const { items, total } = await normalizeItemsAndTotal(body.items)
      normalizedItemsForSave = items
      updates.push("items = ?")
      values.push(JSON.stringify(items))

      updates.push("value = ?")
      values.push(total)
    }

    if (body.payment_method !== undefined) {
      updates.push("payment_method = ?")
      values.push(body.payment_method)
    }
    
    if (body.name !== undefined) {
      updates.push("name = ?")
      values.push(body.name)
    }

    if (body.waiter_name !== undefined) {
      updates.push("waiter_name = ?")
      values.push(body.waiter_name)
    }

    if (updates.length > 0) {
      const sql = `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`
      values.push(id)
      await db.run(sql, values)
    }
    
    const updated = await db.get("SELECT * FROM orders WHERE id = ?", [id])
    if (updated) {
      try {
        updated.items =
          normalizedItemsForSave ?? JSON.parse(updated.items || "[]")
      } catch {
        updated.items = []
      }
      updated.total = updated.value
    }
    
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json().catch(() => ({}))

        const current = await getOrderById(id)
        if (!current) {
          return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
        }

        const requestWaiterName = body?.waiter_name as string | undefined
        if (current.waiter_name && requestWaiterName && current.waiter_name !== requestWaiterName) {
          return NextResponse.json(
            { error: "Mesa pertence a outro garçom" },
            { status: 403 }
          )
        }

        const db = await getDb()
        await db.run("DELETE FROM orders WHERE id = ?", [id])
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const db = await getDb()
        const order = await db.get("SELECT * FROM orders WHERE id = ?", [id])
        if (order) {
            order.items = JSON.parse(order.items || "[]")
            order.total = order.value
            return NextResponse.json(order)
        }
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
