export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface OrderEntity {
  id: string
  table_number: number
  name: string
  items: OrderItem[] | string
  status: OrderStatus
  total: number
  created_at: string
  payment_method?: string
  waiter_name?: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description?: string
  image?: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
  pin: string
}

