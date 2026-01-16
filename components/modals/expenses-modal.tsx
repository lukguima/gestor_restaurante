"use client"

import { useState } from "react"
import { Receipt, DollarSign, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpensesModalProps {
  open: boolean
  onClose: () => void
}

const expenseTypes = [
  { value: "toll", label: "Pedágio" },
  { value: "food", label: "Alimentação" },
  { value: "parking", label: "Estacionamento" },
  { value: "maintenance", label: "Manutenção" },
  { value: "other", label: "Outros" },
]

export function ExpensesModal({ open, onClose }: ExpensesModalProps) {
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-4 max-w-md border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">Registrar Despesa</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Tipo de Despesa</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 border-border bg-secondary text-foreground">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                {expenseTypes.map((expense) => (
                  <SelectItem key={expense.value} value={expense.value} className="text-foreground">
                    {expense.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Valor (R$)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="45,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description" className="text-foreground">
              Descrição
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="expense-description"
                placeholder="Descrição da despesa"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12 border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 flex-1 border-border bg-transparent text-foreground"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="h-12 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Registrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
