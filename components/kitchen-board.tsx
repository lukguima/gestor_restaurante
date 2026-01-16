"use client"

import React, { useState, useEffect } from "react"
import { Clock, CheckCircle2, ChefHat, AlertCircle, RefreshCw } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import type { OrderItem, OrderEntity } from "@/types"

type Order = OrderEntity

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: AlertCircle, next: 'preparing' },
  preparing: { label: 'Preparando', color: 'bg-blue-500', icon: ChefHat, next: 'ready' },
  ready: { label: 'Pronto', color: 'bg-green-500', icon: CheckCircle2, next: 'completed' },
  completed: { label: 'Entregue', color: 'bg-slate-500', icon: CheckCircle2, next: null },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: AlertCircle, next: null }
}

export function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  const loadOrders = () => {
    setLoading(true)
    api.get('/orders')
      .then((data: Order[]) => {
        const parsedOrders = data.map(order => ({
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        }))
        setOrders(parsedOrders)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await api.put(`/orders/${orderId}`, { status: newStatus })
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: updated.status } : o))
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  const getElapsedTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  const OrderCard = ({ order }: { order: Order }) => {
    const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
    const items = order.items as OrderItem[]

    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Mesa {order.table_number}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" /> {getElapsedTime(order.created_at)}
              </CardDescription>
            </div>
            <Badge className={`${config.color} text-white border-0`}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="font-medium">{item.quantity}x {item.name}</span>
              </div>
            ))}
            {items.some(i => i.notes) && (
              <>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  {items.filter(i => i.notes).map((i, idx) => (
                    <p key={idx}><span className="font-bold">Nota:</span> {i.notes}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          {config.next && (
            <Button 
              className="w-full" 
              onClick={() => updateStatus(order.id, config.next!)}
            >
              Mover para {STATUS_CONFIG[config.next as keyof typeof STATUS_CONFIG].label}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  const columns = ['pending', 'preparing', 'ready']

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cozinha</h2>
        <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
        {columns.map(status => (
          <div key={status} className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-4">
              {React.createElement(STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].icon, { className: "w-5 h-5" })}
              <h3 className="font-semibold text-lg capitalize">{STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}</h3>
              <Badge variant="secondary" className="ml-auto">
                {orders.filter(o => o.status === status).length}
              </Badge>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {orders
                  .filter(o => o.status === status)
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                {orders.filter(o => o.status === status).length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhum pedido nesta etapa
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  )
}
