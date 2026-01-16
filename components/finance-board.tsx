"use client"

import React, { useState, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  category: string
  date: string
}

export function FinanceBoard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [managerName, setManagerName] = useState("")
  const [managerPin, setManagerPin] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("todos")
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    description: '',
    amount: 0,
    category: 'Vendas',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const role = localStorage.getItem("waiterRole")
    if (role === "manager") {
      setIsAuthorized(true)
      loadTransactions()
    } else {
      setIsAuthorized(false)
      setIsAuthDialogOpen(true)
    }
  }, [])

  const loadTransactions = () => {
    setLoading(true)
    api.get('/transactions', {
      headers: {
        "x-staff-role": "manager",
      },
    } as any)
      .then((data: Transaction[]) => {
        setTransactions(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const transaction = {
        ...newTransaction,
        id: Date.now().toString(),
        amount: Number(newTransaction.amount)
      }
      const saved = await api.post('/transactions', transaction, {
        headers: {
          "x-staff-role": "manager",
        },
      } as any)
      setTransactions([saved, ...transactions])
      setIsDialogOpen(false)
      setNewTransaction({
        type: 'income',
        description: '',
        amount: 0,
        category: 'Vendas',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error("Failed to save transaction", error)
    }
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const balance = income - expenses

  const filteredTransactions = transactions.filter((t) => {
    const dateOnly = t.date.split("T")[0]
    if (startDate && dateOnly < startDate) return false
    if (endDate && dateOnly > endDate) return false
    if (selectedCategoryFilter !== "todos" && t.category !== selectedCategoryFilter) return false
    return true
  })

  const filteredIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const filteredExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  const filteredBalance = filteredIncome - filteredExpenses

  const categories = Array.from(
    new Set(transactions.map((t) => t.category).filter(Boolean))
  )

  return (
    <div className="p-4 space-y-6">
      <Dialog open={isAuthDialogOpen} onOpenChange={(open) => setIsAuthDialogOpen(open && !isAuthorized)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Acesso restrito ao gerente</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                const result = await api.post("/staff/login", {
                  name: managerName.trim(),
                  pin: managerPin.trim(),
                })
                if (result.role !== "manager") {
                  alert("Apenas usuários com papel de GERENTE podem acessar o financeiro.")
                  return
                }
                localStorage.setItem("waiterName", result.name)
                localStorage.setItem("waiterRole", result.role)
                setIsAuthorized(true)
                setIsAuthDialogOpen(false)
                setManagerPin("")
                loadTransactions()
              } catch {
                alert("Credenciais inválidas. Verifique nome e PIN.")
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="text-black"
                placeholder="Nome do gerente"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PIN</label>
              <Input
                type="password"
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value)}
                className="text-black"
                maxLength={4}
                placeholder="PIN de 4 dígitos"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!managerName.trim() || !managerPin.trim()}>
              Entrar como gerente
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financeiro</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Período:</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-32"
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Categoria:</label>
            <Select
              value={selectedCategoryFilter}
              onValueChange={(v) => setSelectedCategoryFilter(v)}
            >
              <SelectTrigger className="h-8 w-36">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(v: any) =>
                        setNewTransaction({ ...newTransaction, type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valor (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: e.target.value as any,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(v) =>
                      setNewTransaction({ ...newTransaction, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Insumos">Insumos</SelectItem>
                      <SelectItem value="Salários">Salários</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Salvar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {(filteredIncome || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {(filteredExpenses || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${filteredBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
              R$ {(filteredBalance || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {t.type === 'income' ? 
                        <ArrowUpRight className="w-4 h-4 text-green-500" /> : 
                        <ArrowDownLeft className="w-4 h-4 text-red-500" />
                      }
                      {t.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} R$ {(t.amount || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
