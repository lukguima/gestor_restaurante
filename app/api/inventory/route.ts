import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    await db.run(`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        name TEXT,
        unit TEXT,
        quantity REAL,
        min_quantity REAL
      )
    `)
    const rows = await db.all("SELECT * FROM inventory ORDER BY name ASC")
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, unit, quantity, min_quantity } = body
    const db = await getDb()
    await db.run(
      "INSERT INTO inventory (id, name, unit, quantity, min_quantity) VALUES (?, ?, ?, ?, ?)",
      [id, name, unit, quantity, min_quantity ?? 0]
    )
    return NextResponse.json({ id, name, unit, quantity, min_quantity: min_quantity ?? 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, unit, quantity, min_quantity } = body
    const db = await getDb()
    await db.run(
      "UPDATE inventory SET name = ?, unit = ?, quantity = ?, min_quantity = ? WHERE id = ?",
      [name, unit, quantity, min_quantity ?? 0, id]
    )
    return NextResponse.json({ id, name, unit, quantity, min_quantity: min_quantity ?? 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    const db = await getDb()
    await db.run("DELETE FROM inventory WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

