"use client"

import {
  Utensils,
  ChefHat,
  DollarSign,
  Settings,
  Menu,
  LayoutDashboard,
  Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

export type Page = "tables" | "menu" | "kitchen" | "finance" | "settings"

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const menuItems = [
  { id: "tables" as Page, label: "Mesas", icon: LayoutDashboard },
  { id: "menu" as Page, label: "Cardápio", icon: Utensils },
  { id: "kitchen" as Page, label: "Cozinha", icon: ChefHat },
  { id: "finance" as Page, label: "Financeiro", icon: DollarSign },
  { id: "settings" as Page, label: "Configurações", icon: Settings },
]

export function RestaurantSidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
  const [restaurantName, setRestaurantName] = useState("Restaurante")

  useEffect(() => {
    api.get('/config')
      .then((data: any) => {
        if (data && data.restaurantName) {
          setRestaurantName(data.restaurantName)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card border-r border-border flex flex-col transition-all duration-300",
          isOpen ? "w-64" : "w-20",
          "translate-x-0",
          !isOpen && "max-md:-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border h-16">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground truncate max-w-[180px]" title={restaurantName}>
                {restaurantName}
              </span>
              <span className="text-xs text-muted-foreground">Gestão</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id)
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                currentPage === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
          
          <Link
            href="/waiter"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all mt-4",
              "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Smartphone className="h-5 w-5 shrink-0" />
            {isOpen && <span className="font-medium">Modo Garçom</span>}
          </Link>
        </nav>
      </aside>
    </>
  )
}
