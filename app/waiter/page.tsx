"use client"

import React, { useState } from "react"
import { Users, Coffee, Plus, Search, ChevronLeft, Send, Utensils, LogOut, Printer } from "lucide-react"
import { api } from "@/lib/api"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Table {
  id: string
  name: string
  seats: number
}

import type { OrderItem, MenuItem, OrderEntity } from "@/types"

type Order = OrderEntity

export default function WaiterPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Waiter Identity
  const [waiterName, setWaiterName] = useState("")
  const [waiterPin, setWaiterPin] = useState("")
  const [isLoginOpen, setIsLoginOpen] = useState(true)

  // Interaction states
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Partial<Order> | null>(null)
  
  // Order Form
  const [customerName, setCustomerName] = useState("")
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("Todos")

  const fetcher = async (endpoint: string) => api.get(endpoint)

  const { data: tablesData } = useSWR<Table[]>("/tables", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })
  const { data: ordersData } = useSWR<Order[]>("/orders", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })
  const { data: menuData } = useSWR<MenuItem[]>("/menu", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  React.useEffect(() => {
    const savedName = localStorage.getItem("waiterName")
    if (savedName) {
      setWaiterName(savedName)
      setIsLoginOpen(false)
    }
  }, [])

  React.useEffect(() => {
    if (!tablesData || !ordersData || !menuData) return

    setTables(tablesData)

    const activeOrders = ordersData
      .map((o: any) => ({
        ...o,
        items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
      }))
      .filter(
        (o: Order) => o.status !== "completed" && o.status !== "cancelled"
      )

    setOrders(activeOrders)
    setMenu(menuData)
    setLoading(false)
  }, [tablesData, ordersData, menuData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waiterName.trim() || !waiterPin.trim()) return
    try {
      const result = await api.post("/staff/login", {
        name: waiterName.trim(),
        pin: waiterPin.trim(),
      })
      setWaiterName(result.name)
      localStorage.setItem("waiterName", result.name)
      localStorage.setItem("waiterRole", result.role || "")
      setIsLoginOpen(false)
      setWaiterPin("")
    } catch (error) {
      alert("Falha no login. Verifique nome e PIN.")
    }
  }

  const getTableOrder = (tableId: string) => {
    const tableNum = parseInt(tables.find(t => t.id === tableId)?.name.replace(/\D/g, '') || '0')
    return orders.find(o => o.table_number === tableNum)
  }

  const handleTableClick = (table: Table) => {
    const order = getTableOrder(table.id)
    
    // Check if table is occupied by another waiter
    if (order && order.waiter_name && order.waiter_name !== waiterName) {
        // toast({
        //     title: "Acesso Negado",
        //     description: `Mesa atendida por ${order.waiter_name}`,
        //     variant: "destructive"
        // })
        alert(`Mesa atendida por ${order.waiter_name}`)
        return
    }

    setSelectedTable(table)
    
    if (order) {
      setCustomerName(order.name || "")
      setSelectedItems(order.items as OrderItem[])
      setCurrentOrder(order)
    } else {
      setCustomerName(`Cliente Mesa ${table.name.replace(/\D/g, '')}`)
      setSelectedItems([])
      setCurrentOrder(null)
    }
    
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

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems(selectedItems.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(0, i.quantity + delta)
        return { ...i, quantity: newQty }
      }
      return i
    }).filter(i => i.quantity > 0))
  }

  const calculateTotal = () => {
    return selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }

  const saveOrder = async () => {
    if (!selectedTable) return

    try {
      const tableNum = parseInt(selectedTable.name.replace(/\D/g, '') || '0')
      const orderData = {
        table_number: tableNum,
        name: customerName,
        items: JSON.stringify(selectedItems),
        total: calculateTotal(),
        status: currentOrder ? currentOrder.status : 'pending',
        type: 'dine-in',
        waiter_name: waiterName
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
      alert("Erro ao salvar pedido")
    }
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
            Garçom: ${waiterName || "-"}
          </div>
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

  const categories = ["Todos", ...Array.from(new Set(menu.map(item => item.category)))]
  
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Mobile Header */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => window.history.back()}>
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-800">Garçom</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">{waiterName || "Offline"}</span>
          </div>
          {waiterName && (
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-500 hover:text-red-600"
                onClick={() => {
                    localStorage.removeItem("waiterName")
                    localStorage.removeItem("waiterRole")
                    setWaiterName("")
                    setWaiterPin("")
                    setIsLoginOpen(true)
                }}
            >
                <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-slate-700">Mesas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map(table => {
              const activeOrder = getTableOrder(table.id)
              const isOccupied = !!activeOrder
              const isMyOrder = activeOrder?.waiter_name === waiterName
              const isLocked = isOccupied && !isMyOrder

              return (
                <Card 
                  key={table.id} 
                  className={`cursor-pointer transition-all active:scale-95 border-t-4 ${
                    isOccupied 
                      ? (isMyOrder ? 'border-t-orange-600 bg-orange-500 shadow-md' : 'border-t-slate-500 bg-slate-200 opacity-80')
                      : 'border-t-green-500 bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center min-h-[120px]">
                    <div className="flex justify-between w-full mb-2">
                        <span className={`font-bold text-lg ${isMyOrder ? 'text-white' : 'text-slate-800'}`}>
                            {table.name}
                        </span>
                        {isOccupied && (
                            <Badge className={`${isMyOrder ? "bg-white text-orange-600 hover:bg-white" : "bg-slate-600 text-white"}`}>
                                {isMyOrder ? "Ocupada" : (activeOrder?.waiter_name || "Ocupada")}
                            </Badge>
                        )}
                    </div>
                    
                    {isOccupied ? (
                      <div className="text-center w-full">
                        <div className={`${isMyOrder ? "text-orange-100" : "text-slate-600"} text-sm mb-1 truncate px-2`}>
                          {activeOrder.name}
                        </div>
                        <div className={`${isMyOrder ? "text-white" : "text-slate-800"} font-bold text-xl`}>
                          R$ {Number(activeOrder.total || 0).toFixed(2)}
                        </div>
                        {isMyOrder && (
                            <div className="text-orange-100 text-xs mt-2 flex justify-center items-center gap-1">
                                <Utensils className="w-3 h-3" />
                                {(activeOrder.items as any[]).length} itens
                            </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Coffee className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium uppercase tracking-wide">Livre</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      {/* Order Dialog (Mobile Optimized) */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 sm:rounded-xl overflow-hidden bg-slate-50">
          <DialogHeader className="px-4 py-3 bg-white border-b flex-shrink-0">
            <DialogTitle className="flex justify-between items-center text-black">
              <span>{selectedTable?.name}</span>
              <span className="text-black font-bold">Total: R$ {calculateTotal().toFixed(2)}</span>
            </DialogTitle>
            <Input 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nome do cliente (opcional)"
                className="mt-2 h-8 text-sm text-black placeholder:text-gray-500"
            />
          </DialogHeader>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Menu Section */}
            <div className="flex-1 flex flex-col h-1/2 md:h-full border-b md:border-b-0 md:border-r bg-white">
                <div className="p-2 border-b space-y-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar item..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-8" 
                        />
                    </div>
                    <ScrollArea className="w-full whitespace-nowrap pb-2">
                        <div className="flex gap-2">
                            {categories.map(cat => (
                                <Badge 
                                    key={cat}
                                    variant={activeCategory === cat ? "default" : "outline"}
                                    className={`cursor-pointer px-3 py-1 text-sm whitespace-nowrap ${
                                        activeCategory === cat 
                                            ? "" 
                                            : "bg-white text-black hover:bg-slate-100 border-slate-200"
                                    }`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                
                <ScrollArea className="flex-1 p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredMenu.map(item => (
                            <div 
                                key={item.id} 
                                className="flex justify-between items-center p-3 rounded-lg border bg-white shadow-sm hover:border-primary active:bg-slate-50 cursor-pointer"
                                onClick={() => addItem(item)}
                            >
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="font-medium text-sm truncate text-black">{item.name}</div>
                                    <div className="text-xs text-black font-semibold">R$ {Number(item.price).toFixed(2)}</div>
                                </div>
                                <Button size="icon" className="h-8 w-8 shrink-0 rounded-full">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Order Summary Section */}
            <div className="flex-1 flex flex-col h-1/2 md:h-full bg-slate-50">
                <div className="p-3 bg-slate-100 border-b font-semibold text-sm text-black flex justify-between">
                    <span>Resumo do Pedido</span>
                    <Badge variant="secondary" className="text-black">{(selectedItems || []).reduce((acc, i) => acc + i.quantity, 0)} itens</Badge>
                </div>
                <ScrollArea className="flex-1 p-3">
                    <div className="space-y-2">
                        {selectedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10 opacity-50">
                                <Utensils className="h-10 w-10 mb-2" />
                                <p>Nenhum item adicionado</p>
                            </div>
                        ) : (
                            selectedItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-black">{item.name}</div>
                                        <div className="text-xs text-black">R$ {(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                                        <button 
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-lg font-bold text-black active:bg-slate-200"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="font-bold w-4 text-center text-black">{item.quantity}</span>
                                        <button 
                                            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded shadow-sm text-lg font-bold active:bg-primary/90"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                
                <div className="p-4 bg-white border-t space-y-3">
                  <div className="flex justify-between items-center text-xl font-bold text-black">
                      <span>Total</span>
                      <span className="text-black">R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 text-sm font-medium mb-2"
                    onClick={printCurrentOrder}
                    disabled={selectedItems.length === 0}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir comanda
                  </Button>
                  <Button className="w-full h-12 text-lg font-bold shadow-lg" onClick={saveOrder} disabled={selectedItems.length === 0}>
                    <Send className="w-5 h-5 mr-2" />
                    {currentOrder ? "Atualizar Pedido" : "Enviar Pedido"}
                  </Button>
                </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={() => {}}>
        <DialogContent className="bg-white sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-black">Identificação do Garçom</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Digite seu nome"
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
              className="text-black"
              autoFocus
            />
            <Input
              type="password"
              placeholder="PIN de acesso"
              value={waiterPin}
              onChange={(e) => setWaiterPin(e.target.value)}
              className="text-black"
              maxLength={4}
            />
            <Button type="submit" className="w-full" disabled={!waiterName.trim()}>
              Entrar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
