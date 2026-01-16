import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

async function assertManager(request: Request) {
  const header = request.headers.get("x-staff-role")
  if (header !== "manager") {
    return NextResponse.json(
      { error: "Acesso financeiro permitido apenas para gerente" },
      { status: 403 }
    )
  }
  return null
}

export async function GET(request: Request) {
  try {
    const denial = await assertManager(request)
    if (denial) return denial

    const db = await getDb()
    await db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT,
      description TEXT,
      amount REAL,
      category TEXT,
      date TEXT
    )`);

    const rows = await db.all("SELECT * FROM transactions ORDER BY date DESC")
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const denial = await assertManager(request)
    if (denial) return denial

    const body = await request.json()
    const { id, type, description, amount, category, date } = body
    const db = await getDb()
    
    await db.run(
      "INSERT INTO transactions (id, type, description, amount, category, date) VALUES (?, ?, ?, ?, ?, ?)",
      [id, type, description, amount, category, date],
    )
    
    return NextResponse.json(body)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
