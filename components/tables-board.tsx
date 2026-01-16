"use client"

import React, { useState, useEffect } from "react"
import { Users, Coffee, Plus, FileText, CheckCircle2, Clock, Printer } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Table {
  id: string
  name: string
  seats: number
}

import type { OrderItem, MenuItem, OrderEntity } from "@/types"

type Order = OrderEntity

export function TablesBoard() {
  const [tables, setTables] = useState<Table[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog states
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Partial<Order> | null>(null)
  
  // New Order Form
  const [customerName, setCustomerName] = useState("")
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [tablesData, ordersData, menuData] = await Promise.all([
        api.get('/tables'),
        api.get('/orders'),
        api.get('/menu')
      ])
      
      setTables(tablesData)
      
      // Process orders
      const activeOrders = ordersData
        .map((o: any) => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
        }))
        .filter((o: Order) => o.status !== 'completed' && o.status !== 'cancelled')
      
      setOrders(activeOrders)
      setMenu(menuData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const getTableOrder = (tableId: string) => {
    // Assuming table names are like "Mesa 1", "Mesa 2". 
    // Ideally we should match by ID, but order stores table_number (int) or string.
    // Let's try to match by parsing table name number or if table stored its ID in order.
    // Current order schema has table_number. Let's assume table.name contains the number.
    const tableNum = parseInt(tables.find(t => t.id === tableId)?.name.replace(/\D/g, '') || '0')
    return orders.find(o => o.table_number === tableNum)
  }

  const handleOpenTable = (table: Table) => {
    setSelectedTable(table)
    setCustomerName("")
    setSelectedItems([])
    setPaymentMethod("")
    setCurrentOrder(null)
    setIsOrderDialogOpen(true)
  }

  const handleViewOrder = (table: Table, order: Order) => {
    setSelectedTable(table)
    setCustomerName(order.name || "")
    setSelectedItems(order.items as OrderItem[])
    setPaymentMethod(order.payment_method || "")
    setCurrentOrder(order)
    setIsOrderDialogOpen(true)
  }

  const addItem = (menuItem: MenuItem) => {
    const existing = selectedItems.find(i => i.id === menuItem.id)
    if (existing) {
      setSelectedItems(selectedItems.map(i => 
        i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setSelectedItems([...selectedItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: Number(menuItem.price),
        quantity: 1
      }])
    }
  }

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems(selectedItems.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta)
        return { ...i, quantity: newQty }
      }
      return i
    }))
  }

  const calculateTotal = () => {
    return selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }

  const printCurrentOrder = () => {
    if (!selectedTable || selectedItems.length === 0) return

    const tableLabel = selectedTable.name
    const customerLabel = customerName || tableLabel
    const total = calculateTotal()
    const createdAt =
      (currentOrder as any)?.created_at || new Date().toISOString()

    const itemsRows = selectedItems
      .map(
        (item) =>
          `<tr><td>${item.quantity}x ${item.name}</td><td style="text-align:right">R$ ${(item.price * item.quantity).toFixed(
            2
          )}</td></tr>`
      )
      .join("")

    const html = `
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Comanda ${tableLabel}</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 16px; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            h2 { font-size: 14px; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
            td { padding: 4px 0; border-bottom: 1px dashed #ddd; }
            .totals { margin-top: 12px; font-size: 14px; font-weight: 600; }
            .meta { font-size: 11px; color: #555; margin-top: 8px; }
          </style>
        </head>
        <body>
          <h1>${tableLabel}</h1>
          <h2>${customerLabel}</h2>
          <div class="meta">
            Data/Hora: ${new Date(createdAt).toLocaleString("pt-BR")}
          </div>
          <table>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
          <div class="totals">
            Total: R$ ${total.toFixed(2)}
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank", "width=480,height=640")
    if (!printWindow) return
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 300)
  }

  const saveOrder = async () => {
    if (!selectedTable) return

    try {
      const tableNum = parseInt(selectedTable.name.replace(/\D/g, '') || '0')
      const orderData = {
        table_number: tableNum,
        name: customerName || `Mesa ${tableNum}`,
        items: JSON.stringify(selectedItems),
        total: calculateTotal(),
        status: currentOrder ? currentOrder.status : 'pending',
        type: 'dine-in',
        payment_method: paymentMethod
      }

      if (currentOrder?.id) {
        await api.put(`/orders/${currentOrder.id}`, orderData)
      } else {
        await api.post('/orders', { ...orderData, id: Date.now().toString() })
      }

      setIsOrderDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Failed to save order", error)
    }
  }

  const closeOrder = async () => {
    if (!currentOrder?.id) return

    if (!paymentMethod) {
      alert("Por favor, selecione uma forma de pagamento para fechar a conta.")
      return
    }

    if (confirm("Confirmar fechamento da conta?")) {
      try {
        const finalTotal = calculateTotal()
        
        await api.put(`/orders/${currentOrder.id}`, { 
          status: 'completed',
          items: JSON.stringify(selectedItems),
          total: finalTotal,
          payment_method: paymentMethod
        })
        
        // Create transaction
        await api.post('/transactions', {
          id: Date.now().toString(),
          type: 'income',
          description: `Pedido Mesa ${currentOrder.table_number} - ${currentOrder.name} (${paymentMethod})`,
          amount: finalTotal,
          category: 'Vendas',
          date: new Date().toISOString()
        })

        setIsOrderDialogOpen(false)
        fetchData()
      } catch (error) {
        console.error("Failed to close order", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Mesas</h2>
          <p className="text-muted-foreground">Visão geral e controle de pedidos</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Ocupada</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map(table => {
          const activeOrder = getTableOrder(table.id)
          const isOccupied = !!activeOrder

          return (
            <Card 
              key={table.id} 
              className={`cursor-pointer transition-all hover:shadow-md border-t-4 ${isOccupied ? 'border-t-orange-600 bg-orange-500 dark:bg-orange-900' : 'border-t-green-500'}`}
              onClick={() => isOccupied ? handleViewOrder(table, activeOrder) : handleOpenTable(table)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className={`text-xl flex items-center gap-2 ${isOccupied ? 'text-white' : ''}`}>
                      {table.name}
                      {isOccupied && activeOrder.name && (
                        <span className="text-sm font-medium text-orange-50 truncate max-w-[120px]">
                          - {activeOrder.name}
                        </span>
                      )}
                    </CardTitle>
                  </div>
                  <Badge variant={isOccupied ? "default" : "secondary"} className={isOccupied ? "bg-white text-orange-600 hover:bg-orange-50" : "bg-green-500 hover:bg-green-600 text-white"}>
                    {isOccupied ? "Ocupada" : "Livre"}
                  </Badge>
                </div>
                <div className={`flex items-center text-sm gap-1 ${isOccupied ? 'text-orange-50' : 'text-muted-foreground'}`}>
                  <Users className="w-4 h-4" />
                  {table.seats} Lugares
                </div>
              </CardHeader>
              <CardContent>
                {isOccupied ? (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-50">Total:</span>
                      <span className="font-bold text-xl text-white">
                        R$ {(activeOrder.total || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm items-center mt-2">
                      <Badge variant="outline" className="text-xs border-orange-200/40 text-white bg-white/20">
                        {(activeOrder.items as any[]).length} itens
                      </Badge>
                      <span className="text-xs text-orange-50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activeOrder.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[88px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Coffee className="w-8 h-8 mb-2" />
                    <span className="text-sm">Toque para abrir</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedTable?.name} - {currentOrder ? 'Pedido em Andamento' : 'Novo Pedido'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-1 gap-6 overflow-hidden min-h-[400px]">
            {/* Left: Menu Selection */}
            <div className="w-1/2 flex flex-col border-r pr-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Cardápio
              </h3>
              <div className="mb-4">
                <Input placeholder="Buscar item..." className="mb-2" />
              </div>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-2">
                  {menu.map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-2 rounded-md border hover:bg-accent cursor-pointer"
                      onClick={() => addItem(item)}
                    >
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">R$ {Number(item.price).toFixed(2)}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Order Summary */}
            <div className="w-1/2 flex flex-col">
              <div className="space-y-4 mb-4">
                <div>
                  <Label>Nome do Cliente / Identificação</Label>
                  <Input 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 border rounded-md p-4 flex flex-col">
                <div className="flex-1 overflow-auto space-y-3">
                  {selectedItems.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhum item adicionado
                    </div>
                  ) : (
                    selectedItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              className="w-5 h-5 flex items-center justify-center bg-secondary rounded hover:bg-secondary/80"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <button 
                              className="w-5 h-5 flex items-center justify-center bg-secondary rounded hover:bg-secondary/80"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                            <button 
                              className="w-5 h-5 flex items-center justify-center text-red-500 hover:bg-red-50 rounded"
                              onClick={() => removeItem(item.id)}
                            >
                              x
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            {currentOrder && (
              <Button variant="destructive" onClick={closeOrder} className="mr-auto">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Fechar Conta
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={printCurrentOrder}
              disabled={selectedItems.length === 0}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir comanda
            </Button>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveOrder} disabled={selectedItems.length === 0}>
              {currentOrder ? "Atualizar Pedido" : "Abrir Mesa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
