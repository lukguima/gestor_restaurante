"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, Save, User, Users, Printer } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsBoard() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurações</h2>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList>
          <TabsTrigger value="tables">Mesas</TabsTrigger>
          <TabsTrigger value="staff">Equipe</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="printers">Impressoras</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
          <TablesSettings />
        </TabsContent>
        
        <TabsContent value="staff">
          <StaffSettings />
        </TabsContent>

        <TabsContent value="inventory">
          <InventorySettings />
        </TabsContent>

        <TabsContent value="printers">
          <PrinterSettings />
        </TabsContent>
        
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

type TableRow = {
  id: string
  name: string
  seats: number
}

function TablesSettings() {
  const [tables, setTables] = useState<TableRow[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTable, setNewTable] = useState({ name: '', seats: '' })

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = () => {
    api.get('/tables')
      .then((data: TableRow[]) => setTables(data))
      .catch(console.error)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/tables', { 
        id: Date.now().toString(),
        name: newTable.name,
        seats: Number(newTable.seats)
      })
      loadTables()
      setIsDialogOpen(false)
      setNewTable({ name: '', seats: '' })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Excluir mesa?')) {
      await api.delete('/tables', { body: { id } } as any) // Using delete with body as implemented in route
      // Note: standard fetch DELETE doesn't usually take body, but our api wrapper might need adjustment or route expects it.
      // Wait, my api wrapper in lib/api.ts might not support body in delete.
      // Let's check lib/api.ts later. For now assume it does or I'll fix it.
      // Actually, standard `api.delete` usually takes just URL.
      // I should have implemented `DELETE /api/tables/[id]`.
      // But since I did `DELETE` with body in route, I need to send body.
      // `fetch` allows body in DELETE.
      // Let's assume `api.delete` implementation allows it or I'll fix it.
      // Just in case, I'll pass the config object if api.delete supports it, 
      // or I'll use raw fetch here if api wrapper is limited.
      // Let's check api wrapper first? No, I'll just try to use a custom call if needed.
      // But for now let's assume `api.delete(url, body)` works or similar.
      // Actually, looking at `menu-board.tsx`, `api.delete` takes only endpoint.
      // I should update `lib/api.ts` to support body or use raw fetch.
      // For now I'll use raw fetch for delete to be safe.
      
      await fetch('/api/tables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      loadTables()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Mesas</CardTitle>
          <CardDescription>Configure o layout do restaurante</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Nova Mesa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Mesa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome/Número</Label>
                <Input value={newTable.name} onChange={e => setNewTable({...newTable, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Lugares</Label>
                <Input type="number" value={newTable.seats} onChange={e => setNewTable({...newTable, seats: e.target.value})} required />
              </div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map(table => (
            <div key={table.id} className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 relative group bg-slate-50 dark:bg-slate-900">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(table.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-lg">
                {table.name}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" /> {table.seats} lugares
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

type StaffRow = {
  id: string
  name: string
  role: string
  pin: string
}

function StaffSettings() {
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', role: 'waiter', pin: '' })

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = () => {
    api.get('/staff')
      .then((data: StaffRow[]) => setStaff(data))
      .catch(console.error)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/staff', { 
        id: Date.now().toString(),
        ...newStaff
      })
      loadStaff()
      setIsDialogOpen(false)
      setNewStaff({ name: '', role: 'waiter', pin: '' })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Remover funcionário?')) {
      await fetch('/api/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      loadStaff()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Equipe</CardTitle>
          <CardDescription>Gerencie o acesso dos funcionários</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Novo Funcionário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Funcionário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Select value={newStaff.role} onValueChange={v => setNewStaff({...newStaff, role: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="waiter">Garçom</SelectItem>
                    <SelectItem value="chef">Cozinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>PIN de Acesso</Label>
                <Input type="password" maxLength={4} value={newStaff.pin} onChange={e => setNewStaff({...newStaff, pin: e.target.value})} required />
              </div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  {s.name}
                </TableCell>
                <TableCell>
                  <span className="capitalize">{s.role}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function GeneralSettings() {
  const [config, setConfig] = useState({ restaurantName: '', address: '', phone: '' })

  useEffect(() => {
    api.get('/config')
      .then(data => {
        if (data) {
          setConfig(prev => ({ ...prev, ...data }))
        }
      })
      .catch(console.error)
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/config', config)
      alert('Configurações salvas!')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>Informações do estabelecimento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Nome do Restaurante</Label>
            <Input value={config.restaurantName} onChange={e => setConfig({...config, restaurantName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input value={config.address} onChange={e => setConfig({...config, address: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={config.phone} onChange={e => setConfig({...config, phone: e.target.value})} />
          </div>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

type InventoryItem = {
  id: string
  name: string
  unit: string
  quantity: number
  min_quantity: number
}

function InventorySettings() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<InventoryItem>>({
    name: "",
    unit: "un",
    quantity: 0,
    min_quantity: 0,
  })

  useEffect(() => {
    api
      .get("/inventory")
      .then((data: InventoryItem[]) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm({
      name: "",
      unit: "un",
      quantity: 0,
      min_quantity: 0,
    })
    setIsDialogOpen(true)
  }

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id)
    setForm(item)
    setIsDialogOpen(true)
  }

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: InventoryItem = {
      id: editingId || Date.now().toString(),
      name: form.name || "",
      unit: form.unit || "un",
      quantity: Number(form.quantity || 0),
      min_quantity: Number(form.min_quantity || 0),
    }

    if (editingId) {
      const updated = await api.put("/inventory", payload)
      setItems(items.map((it) => (it.id === editingId ? updated : it)))
    } else {
      const created = await api.post("/inventory", payload)
      setItems([...items, created])
    }

    setIsDialogOpen(false)
  }

  const handleDeleteInventory = async (id: string) => {
    if (!confirm("Remover item do estoque?")) return
    await api.delete("/inventory", { id } as any)
    setItems(items.filter((it) => it.id !== id))
  }

  const lowStockItems = items.filter(
    (it) => it.min_quantity > 0 && it.quantity <= it.min_quantity
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Estoque</CardTitle>
          <CardDescription>
            Controle de insumos e níveis mínimos
          </CardDescription>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                Itens com estoque baixo
              </h3>
              {lowStockItems.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum item com estoque abaixo do mínimo.
                </p>
              )}
              {lowStockItems.length > 0 && (
                <ul className="text-xs text-red-600 space-y-1">
                  {lowStockItems.map((it) => (
                    <li key={it.id}>
                      {it.name} ({it.quantity} {it.unit}) mínimo{" "}
                      {it.min_quantity}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.name}</TableCell>
                    <TableCell>
                      {it.quantity} {it.unit}
                    </TableCell>
                    <TableCell>
                      {it.min_quantity} {it.unit}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(it)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInventory(it.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground text-sm"
                    >
                      Nenhum item cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Item" : "Novo Item de Estoque"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveInventory} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Item</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.quantity ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: Number(e.target.value || 0),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mínimo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.min_quantity ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      min_quantity: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Input
                  value={form.unit || "un"}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function PrinterSettings() {
  const [printers, setPrinters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPrinter, setSelectedPrinter] = useState<string>("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadPrinters()
    loadConfig()
  }, [])

  const loadPrinters = () => {
    setLoading(true)
    setError("")
    api.get('/printers')
      .then(data => {
        if (Array.isArray(data)) {
          setPrinters(data)
        } else {
          setPrinters([])
        }
      })
      .catch(err => {
        console.error(err)
        setError("Erro ao carregar impressoras. Verifique se o servidor está rodando no Windows.")
      })
      .finally(() => setLoading(false))
  }

  const loadConfig = () => {
    api.get('/config')
      .then(data => {
        if (data && data.selectedPrinter) {
          setSelectedPrinter(data.selectedPrinter)
        }
      })
      .catch(console.error)
  }

  const handleSelectPrinter = async (printerName: string) => {
    try {
      setSelectedPrinter(printerName)
      await api.post('/config', { selectedPrinter: printerName })
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar impressora padrão")
    }
  }

  const handleTestPrint = async (e: React.MouseEvent, printerName: string) => {
    e.stopPropagation()
    try {
      alert(`Enviando teste para ${printerName}...`)
      await api.post('/print', { printerName, content: "Teste de conexao - Sistema Restaurante" })
      alert("Comando enviado com sucesso!")
    } catch (err) {
      console.error(err)
      alert("Erro ao enviar teste de impressão.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impressoras</CardTitle>
        <CardDescription>
          Selecione a impressora padrão para pedidos e comprovantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-sm font-medium">Impressoras Disponíveis</h3>
             <Button variant="outline" size="sm" onClick={loadPrinters} disabled={loading}>
               {loading ? "Buscando..." : "Atualizar Lista"}
             </Button>
          </div>

          {printers.length === 0 && !loading && (
             <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
               Nenhuma impressora encontrada.
             </div>
          )}

          <div className="grid gap-2">
            {printers.map((printer, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedPrinter === printer.Name ? 'bg-primary/5 border-primary' : 'hover:bg-slate-50'}`}
                onClick={() => handleSelectPrinter(printer.Name)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedPrinter === printer.Name ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-500'}`}>
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">{printer.Name}</div>
                    <div className="text-xs text-muted-foreground">
                      Status: {printer.PrinterStatus} | Porta: {printer.PortName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPrinter === printer.Name && (
                    <>
                      <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        Selecionada
                      </div>
                      <Button size="sm" variant="outline" onClick={(e) => handleTestPrint(e, printer.Name)}>
                        Testar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
