"use client"

import { useState } from "react"
import { RestaurantSidebar, Page } from "@/components/restaurant-sidebar"
import { TablesBoard } from "@/components/tables-board"
import { MenuBoard } from "@/components/menu-board"
import { KitchenBoard } from "@/components/kitchen-board"
import { FinanceBoard } from "@/components/finance-board"
import { SettingsBoard } from "@/components/settings-board"
import { cn } from "@/lib/utils"

export function RestaurantDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>("tables")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case "tables":
        return <TablesBoard />
      case "menu":
        return <MenuBoard />
      case "kitchen":
        return <KitchenBoard />
      case "finance":
        return <FinanceBoard />
      case "settings":
        return <SettingsBoard />
      default:
        return <MenuBoard />
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <RestaurantSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <div className="container mx-auto py-6 max-w-7xl">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
