"use client"

import { useState } from "react"
import { AlertTriangle, Camera, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportIncidentModalProps {
  open: boolean
  onClose: () => void
}

const incidentTypes = [
  { value: "tire", label: "Pneu Furado" },
  { value: "mechanical", label: "Problema Mecânico" },
  { value: "accident", label: "Acidente" },
  { value: "cargo", label: "Problema com Carga" },
  { value: "other", label: "Outro" },
]

export function ReportIncidentModal({ open, onClose }: ReportIncidentModalProps) {
  const [type, setType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-4 max-w-md border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">Reportar Incidente</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Tipo de Incidente</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 border-border bg-secondary text-foreground">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                {incidentTypes.map((incident) => (
                  <SelectItem key={incident.value} value={incident.value} className="text-foreground">
                    {incident.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">
              Localização
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="BR-116 km 340"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva o incidente..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            variant="outline"
            className="h-12 w-full border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground"
          >
            <Camera className="mr-2 h-5 w-5" />
            Adicionar Fotos
          </Button>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 flex-1 border-border bg-transparent text-foreground"
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="h-12 flex-1 bg-destructive text-white hover:bg-destructive/90">
              Reportar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
