"use client"

import { Home, History, Map, User } from "lucide-react"
import type { PageType } from "@/components/fleet-dashboard"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
}

const navItems = [
  { id: "home" as const, label: "Início", icon: Home },
  { id: "history" as const, label: "Histórico", icon: History },
  { id: "map" as const, label: "Mapa", icon: Map },
  { id: "profile" as const, label: "Perfil", icon: User },
]

export function BottomNav({ currentPage, setCurrentPage }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all active:scale-95",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
