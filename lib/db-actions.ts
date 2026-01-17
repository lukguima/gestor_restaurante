import { getDb } from "@/lib/db"
import type { OrderEntity, OrderItem } from "@/types"

type DbOrderRow = {
  id: string
  name: string | null
  subtitle?: string | null
  date: string | null
  status: string | null
  type: string | null
  value: number | null
  items: string | null
  progress?: number | null
  created_at: string | null
  table_number: number | null
  payment_method?: string | null
  waiter_name?: string | null
}

export async function listOrders(): Promise<OrderEntity[]> {
  const db = await getDb()
  const rows = (await db.all("SELECT * FROM orders ORDER BY created_at DESC")) as DbOrderRow[]

  return rows.map((row) => {
    let parsedItems: OrderItem[] = []
    try {
      parsedItems = JSON.parse(row.items || "[]")
    } catch {
      parsedItems = []
    }

    return {
      id: row.id,
      table_number: row.table_number ?? 0,
      name: row.name ?? "",
      items: parsedItems,
      status: (row.status as OrderEntity["status"]) ?? "pending",
      total: row.value ?? 0,
      created_at: row.created_at ?? row.date ?? new Date().toISOString(),
      payment_method: row.payment_method ?? undefined,
      waiter_name: row.waiter_name ?? undefined,
    }
  })
}

export async function getOrderById(id: string): Promise<DbOrderRow | undefined> {
  const db = await getDb()
  const row = (await db.get("SELECT * FROM orders WHERE id = ?", [id])) as DbOrderRow | undefined
  return row
}

type IncomingOrderItem = {
  id: string
  quantity: number
}

type AnyIncomingItem = {
  id?: unknown
  quantity?: unknown
  [key: string]: unknown
}

export async function normalizeItemsAndTotal(
  rawItems: unknown
): Promise<{ items: OrderItem[]; total: number }> {
  const db = await getDb()

  let parsed: AnyIncomingItem[] = []

  if (Array.isArray(rawItems)) {
    parsed = rawItems as AnyIncomingItem[]
  } else if (typeof rawItems === "string") {
    try {
      parsed = JSON.parse(rawItems) as AnyIncomingItem[]
    } catch {
      parsed = []
    }
  }

  const cleaned: IncomingOrderItem[] = parsed
    .map((item) => {
      const id = typeof item.id === "string" ? item.id : undefined
      const quantityNumber =
        typeof item.quantity === "number" ? item.quantity : Number(item.quantity)

      if (!id || !Number.isFinite(quantityNumber)) return null

      const quantity = Math.floor(quantityNumber)
      if (quantity <= 0) return null

      return { id, quantity }
    })
    .filter((item): item is IncomingOrderItem => item !== null)

  if (cleaned.length === 0) {
    throw new Error("Itens do pedido inválidos")
  }

  const ids = cleaned.map((i) => i.id)
  const placeholders = ids.map(() => "?").join(",")
  const menuRows = await db.all<{ id: string; name: string; price: number | null }>(
    `SELECT id, name, price FROM menu_items WHERE id IN (${placeholders})`,
    ids
  )

  const priceMap = new Map<string, { name: string; price: number }>()
  for (const row of menuRows) {
    priceMap.set(row.id, { name: row.name, price: Number(row.price ?? 0) })
  }

  let total = 0
  const items: OrderItem[] = cleaned.map((item) => {
    const menuInfo = priceMap.get(item.id)
    const price = menuInfo?.price ?? 0
    const name = menuInfo?.name ?? ""
    const lineTotal = price * item.quantity
    total += lineTotal

    return {
      id: item.id,
      name,
      price,
      quantity: item.quantity,
    }
  })

  return { items, total }
}
