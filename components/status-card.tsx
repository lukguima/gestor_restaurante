"use client"

import { useState, useEffect } from "react"
import { Car, Coffee, Clock, Play, Square, Timer, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  status: "driving" | "resting" | "waiting"
  setStatus: (status: "driving" | "resting" | "waiting") => void
}

const statusConfig = {
  driving: {
    label: "Dirigindo",
    icon: Car,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/20",
  },
  resting: {
    label: "Descansando",
    icon: Coffee,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/20",
  },
  waiting: {
    label: "Aguardando",
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    glowColor: "shadow-primary/20",
  },
}

export function StatusCard({ status, setStatus }: StatusCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [tripDistance, setTripDistance] = useState(0)
  const config = statusConfig[status]
  const Icon = config.icon

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === "driving") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
        setTripDistance((prev) => prev + Math.random() * 0.5)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleToggleTrip = () => {
    if (status === "driving") {
      setStatus("waiting")
      setElapsedTime(0)
      setTripDistance(0)
    } else {
      setStatus("driving")
    }
  }

  return (
    <Card
      className={cn(
        "mb-6 border-2 transition-all duration-500",
        config.borderColor,
        config.bgColor,
        status === "driving" && "shadow-lg shadow-emerald-500/10",
      )}
    >
      <CardContent className="p-6">
        {/* Status selector pills */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Status Atual</span>
          <div className="flex gap-1.5">
            {(["waiting", "driving", "resting"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "h-2.5 w-8 rounded-full transition-all duration-300",
                  status === s
                    ? cn(statusConfig[s].color.replace("text-", "bg-"), "scale-110")
                    : "bg-muted hover:bg-muted-foreground/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Main status display */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500",
              config.bgColor,
            )}
          >
            {status === "driving" && <span className="absolute inset-0 animate-ping rounded-2xl bg-emerald-500/20" />}
            <Icon className={cn("h-8 w-8 transition-all duration-300", config.color)} />
          </div>
          <div className="flex-1">
            <h2 className={cn("text-2xl font-bold transition-colors duration-300", config.color)}>{config.label}</h2>
            <p className="text-sm text-muted-foreground">
              {status === "driving" && "Viagem em andamento"}
              {status === "resting" && "Pausa para descanso"}
              {status === "waiting" && "Pronto para iniciar"}
            </p>
          </div>
        </div>

        {status === "driving" && (
          <div className="mb-6 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
              <Timer className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">Tempo</p>
                <p className="font-mono text-lg font-semibold text-foreground">{formatTime(elapsedTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">Distância</p>
                <p className="font-mono text-lg font-semibold text-foreground">{tripDistance.toFixed(1)} km</p>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <Button
          onClick={handleToggleTrip}
          className={cn(
            "h-14 w-full gap-3 text-lg font-semibold transition-all duration-300",
            status === "driving"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {status === "driving" ? (
            <>
              <Square className="h-5 w-5" />
              Finalizar Viagem
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Iniciar Nova Viagem
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
