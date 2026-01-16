"use client"

import { useState } from "react"
import { Fuel, MapPin, Receipt } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LogFuelModalProps {
  open: boolean
  onClose: () => void
}

export function LogFuelModal({ open, onClose }: LogFuelModalProps) {
  const [liters, setLiters] = useState("")
  const [price, setPrice] = useState("")
  const [station, setStation] = useState("")
  const [odometer, setOdometer] = useState("")

  const handleSubmit = () => {
    // Handle fuel log submission
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-4 max-w-md border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Fuel className="h-6 w-6 text-emerald-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">Registrar Abastecimento</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters" className="text-foreground">
                Litros
              </Label>
              <Input
                id="liters"
                type="number"
                placeholder="200"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="h-12 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Valor Total (R$)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="1.040,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-12 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="station" className="text-foreground">
              Posto
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="station"
                placeholder="Nome do posto"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="h-12 border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="odometer" className="text-foreground">
              Odômetro (km)
            </Label>
            <div className="relative">
              <Receipt className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="odometer"
                type="number"
                placeholder="125.430"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
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
            <Button onClick={handleSubmit} className="h-12 flex-1 bg-emerald-500 text-white hover:bg-emerald-600">
              Registrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
