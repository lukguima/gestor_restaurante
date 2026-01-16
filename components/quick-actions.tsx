"use client"

import { Fuel, AlertTriangle, Receipt, ClipboardCheck, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ModalType } from "@/components/fleet-dashboard"
import { cn } from "@/lib/utils"

interface QuickActionsProps {
  onActionClick: (action: ModalType) => void
}

const actions = [
  {
    id: "fuel" as const,
    label: "Abastecer",
    icon: Fuel,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    hoverColor: "hover:bg-emerald-500/20",
    ringColor: "ring-emerald-500/20",
    description: "Registrar abastecimento",
  },
  {
    id: "incident" as const,
    label: "Incidente",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    hoverColor: "hover:bg-destructive/20",
    ringColor: "ring-destructive/20",
    description: "Reportar ocorrência",
  },
  {
    id: "expenses" as const,
    label: "Despesas",
    icon: Receipt,
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverColor: "hover:bg-primary/20",
    ringColor: "ring-primary/20",
    description: "Lançar gastos",
  },
  {
    id: "checklist" as const,
    label: "Checklist",
    icon: ClipboardCheck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/20",
    ringColor: "ring-blue-500/20",
    description: "Inspeção veicular",
  },
]

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">Ações Rápidas</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card
              key={action.id}
              className={cn(
                "group cursor-pointer border-border ring-1 ring-transparent transition-all duration-300",
                "hover:ring-2 hover:scale-[1.02] active:scale-95",
                action.hoverColor,
                `hover:${action.ringColor}`,
              )}
              onClick={() => onActionClick(action.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="flex min-h-[110px] flex-col items-center justify-center gap-2 p-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                    "group-hover:scale-110 group-hover:rotate-3",
                    action.bgColor,
                  )}
                >
                  <Icon className={cn("h-6 w-6 transition-all", action.color)} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-medium text-foreground">{action.label}</span>
                  <span className="block text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {action.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
