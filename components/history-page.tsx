"use client"

import { Fuel, AlertTriangle, Receipt, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const historyData = {
  today: [
    {
      id: 1,
      type: "fuel",
      description: "Abastecimento - 200L",
      time: "10:00",
      location: "Posto Shell - Campinas",
      icon: Fuel,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: 2,
      type: "trip",
      description: "Viagem SP → RJ",
      time: "08:30",
      location: "435 km percorridos",
      icon: MapPin,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 3,
      type: "expense",
      description: "Pedágio - R$ 45,00",
      time: "07:15",
      location: "Rod. Dutra km 180",
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ],
  week: [
    {
      id: 4,
      type: "fuel",
      description: "Abastecimento - 180L",
      time: "Ontem 14:00",
      location: "Posto Ipiranga - SP",
      icon: Fuel,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: 5,
      type: "incident",
      description: "Pneu furado",
      time: "Seg 16:30",
      location: "BR-116 km 340",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      id: 6,
      type: "trip",
      description: "Viagem RJ → BH",
      time: "Seg 06:00",
      location: "520 km percorridos",
      icon: MapPin,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ],
  month: [
    {
      id: 7,
      type: "trip",
      description: "12 viagens concluídas",
      time: "Dezembro",
      location: "4.850 km total",
      icon: MapPin,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 8,
      type: "fuel",
      description: "2.400L abastecidos",
      time: "Dezembro",
      location: "R$ 12.480,00",
      icon: Fuel,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: 9,
      type: "expense",
      description: "Despesas totais",
      time: "Dezembro",
      location: "R$ 1.850,00",
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ],
}

export function HistoryPage() {
  return (
    <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Histórico</h1>
          <p className="text-sm text-muted-foreground">Suas atividades recentes</p>
        </div>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger
            value="today"
            className="min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Hoje
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Semana
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Mês
          </TabsTrigger>
        </TabsList>

        {(["today", "week", "month"] as const).map((period) => (
          <TabsContent key={period} value={period} className="space-y-3">
            {historyData[period].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.id} className="border-border">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", item.bgColor)}>
                      <Icon className={cn("h-6 w-6", item.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
