"use client"

import { useState } from "react"
import { ClipboardCheck, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChecklistModalProps {
  open: boolean
  onClose: () => void
}

const checklistItems = [
  { id: 1, label: "Nível de óleo verificado", category: "Motor" },
  { id: 2, label: "Nível de água do radiador", category: "Motor" },
  { id: 3, label: "Pressão dos pneus", category: "Pneus" },
  { id: 4, label: "Estado dos pneus (desgaste)", category: "Pneus" },
  { id: 5, label: "Funcionamento dos faróis", category: "Luzes" },
  { id: 6, label: "Funcionamento das setas", category: "Luzes" },
  { id: 7, label: "Luzes de freio", category: "Luzes" },
  { id: 8, label: "Espelhos retrovisores", category: "Segurança" },
  { id: 9, label: "Cinto de segurança", category: "Segurança" },
  { id: 10, label: "Documentos do veículo", category: "Documentos" },
]

export function ChecklistModal({ open, onClose }: ChecklistModalProps) {
  const [checked, setChecked] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleSubmit = () => {
    onClose()
  }

  const progress = Math.round((checked.length / checklistItems.length) * 100)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-4 max-h-[85vh] max-w-md overflow-hidden border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <ClipboardCheck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Checklist Diário</DialogTitle>
              <p className="text-sm text-muted-foreground">{progress}% concluído</p>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Checklist Items */}
        <div className="mt-4 max-h-[400px] space-y-2 overflow-y-auto pr-2">
          {checklistItems.map((item) => {
            const isChecked = checked.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "flex min-h-[52px] w-full items-center gap-3 rounded-xl p-3 transition-all",
                  isChecked ? "bg-blue-500/10" : "bg-secondary/50 hover:bg-secondary",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all",
                    isChecked ? "border-blue-500 bg-blue-500" : "border-muted-foreground",
                  )}
                >
                  {isChecked && <Check className="h-4 w-4 text-white" />}
                </div>
                <div className="flex-1 text-left">
                  <p className={cn("text-sm font-medium", isChecked ? "text-blue-500" : "text-foreground")}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 flex-1 border-border bg-transparent text-foreground"
          >
            Fechar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={checked.length < checklistItems.length}
            className="h-12 flex-1 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Concluir Checklist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
