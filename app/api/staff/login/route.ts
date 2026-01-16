import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, pin } = await request.json()

    if (!name || !pin) {
      return NextResponse.json(
        { error: "Nome e PIN são obrigatórios" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const staff = await db.get(
      "SELECT id, name, role FROM staff WHERE name = ? AND pin = ?",
      [name, pin]
    )

    if (!staff) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      )
    }

    return NextResponse.json(staff)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

