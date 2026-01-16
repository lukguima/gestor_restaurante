"use client"

import { useState, useEffect } from "react"
import { Truck, Wifi, WifiOff, Bell, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  driverName: string
  truckId: string
  isOnline: boolean
}

export function Header({ driverName, truckId, isOnline }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hasNotifications, setHasNotifications] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {currentTime.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
        </span>
        <span className="font-mono text-sm font-medium text-foreground">
          {currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <Button variant="ghost" size="icon" className="relative h-8 w-8" onClick={() => setHasNotifications(false)}>
          <Bell className="h-4 w-4 text-muted-foreground" />
          {hasNotifications && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
            <Truck className="h-6 w-6 text-primary" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              A
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-lg font-semibold text-foreground">Olá, {driverName}</h1>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{truckId}</p>
          </div>
        </div>

        <Badge
          variant={isOnline ? "default" : "destructive"}
          className={cn(
            "flex min-h-[44px] items-center gap-2 px-3 transition-all duration-300",
            isOnline
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
              : "bg-destructive/10 text-destructive hover:bg-destructive/20",
          )}
        >
          {isOnline ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <Wifi className="h-4 w-4" />
              <span className="font-medium">Online</span>
            </>
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <WifiOff className="h-4 w-4" />
              <span className="font-medium">Offline</span>
            </>
          )}
        </Badge>
      </div>
    </header>
  )
}
