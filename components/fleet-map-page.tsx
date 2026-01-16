"use client"

import { MapPin, Truck, Navigation, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const fleetVehicles = [
  { id: 1, name: "Volvo FH-10", driver: "Carlos", status: "driving", location: "Rod. Dutra km 180" },
  { id: 2, name: "Scania R-450", driver: "Roberto", status: "resting", location: "Posto km 95 - SP" },
  { id: 3, name: "Mercedes Actros", driver: "João", status: "waiting", location: "Terminal RJ" },
]

const statusColors = {
  driving: "bg-emerald-500/10 text-emerald-500",
  resting: "bg-blue-500/10 text-blue-500",
  waiting: "bg-primary/10 text-primary",
}

const statusLabels = {
  driving: "Dirigindo",
  resting: "Descansando",
  waiting: "Aguardando",
}

export function FleetMapPage() {
  return (
    <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mapa da Frota</h1>
            <p className="text-sm text-muted-foreground">3 veículos ativos</p>
          </div>
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Map Placeholder */}
      <Card className="mb-6 overflow-hidden border-border">
        <div className="relative h-48 bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="mx-auto mb-2 h-12 w-12 text-primary/50" />
              <p className="text-sm text-muted-foreground">Mapa interativo</p>
              <p className="text-xs text-muted-foreground">Integre com Google Maps ou Mapbox</p>
            </div>
          </div>
          {/* Mock map markers */}
          <div className="absolute left-1/4 top-1/3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <div className="absolute right-1/3 top-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
            <Truck className="h-4 w-4 text-white" />
          </div>
        </div>
      </Card>

      {/* Fleet List */}
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Veículos da Frota</h3>
      <div className="space-y-3">
        {fleetVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Truck className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{vehicle.name}</p>
                  <Badge className={statusColors[vehicle.status as keyof typeof statusColors]}>
                    {statusLabels[vehicle.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {vehicle.driver} • {vehicle.location}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
