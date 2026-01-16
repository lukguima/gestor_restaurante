"use client"

import { useState } from "react"
import { Fuel, Receipt, MapPin, ChevronRight, Clock, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    type: "fuel",
    description: "Abastecimento - 200L",
    location: "Posto Shell - Campinas",
    time: "10:00",
    date: "Hoje",
    value: "R$ 1.180,00",
    icon: Fuel,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 2,
    type: "trip",
    description: "Viagem SP → RJ concluída",
    location: "430 km percorridos",
    time: "08:30",
    date: "Hoje",
    value: null,
    icon: MapPin,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    type: "expense",
    description: "Pedágio - Via Dutra",
    location: "Km 215",
    time: "07:15",
    date: "Hoje",
    value: "R$ 45,00",
    icon: Receipt,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 4,
    type: "fuel",
    description: "Abastecimento - 150L",
    location: "Posto Ipiranga - Guarulhos",
    time: "18:45",
    date: "Ontem",
    value: "R$ 885,00",
    icon: Fuel,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
]

export function RecentHistory() {
  const [filter, setFilter] = useState<"all" | "fuel" | "trip" | "expense">("all")

  const filteredActivities = activities.filter((activity) => filter === "all" || activity.type === filter)

  return (
    <section>
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Atividades Recentes</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <Filter className="h-3 w-3" />
              Filtrar
            </Button>
          </div>

          <div className="mt-2 flex gap-2">
            {[
              { id: "all", label: "Todos" },
              { id: "fuel", label: "Combustível" },
              { id: "trip", label: "Viagens" },
              { id: "expense", label: "Despesas" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  filter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {filteredActivities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className={cn(
                  "group flex items-center gap-3 rounded-xl bg-secondary/50 p-3 transition-all",
                  "hover:bg-secondary cursor-pointer",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                    "group-hover:scale-110",
                    activity.bgColor,
                  )}
                >
                  <Icon className={cn("h-5 w-5", activity.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="truncate text-xs text-muted-foreground">{activity.location}</p>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  {activity.value && <span className="text-xs font-medium text-foreground">{activity.value}</span>}
                  <span className="text-xs text-muted-foreground">
                    {activity.date} · {activity.time}
                  </span>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )
          })}

          <Button variant="ghost" className="mt-2 w-full text-muted-foreground">
            Ver todo o histórico
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
