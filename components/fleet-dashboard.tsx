"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatusCard } from "@/components/status-card"
import { QuickActions } from "@/components/quick-actions"
import { RecentHistory } from "@/components/recent-history"
import { BottomNav } from "@/components/bottom-nav"
import { HistoryPage } from "@/components/history-page"
import { FleetMapPage } from "@/components/fleet-map-page"
import { ProfilePage } from "@/components/profile-page"
import { LogFuelModal } from "@/components/modals/log-fuel-modal"
import { ReportIncidentModal } from "@/components/modals/report-incident-modal"
import { ExpensesModal } from "@/components/modals/expenses-modal"
import { ChecklistModal } from "@/components/modals/checklist-modal"

export type PageType = "home" | "history" | "map" | "profile"
export type ModalType = "fuel" | "incident" | "expenses" | "checklist" | null

export function FleetDashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [driverStatus, setDriverStatus] = useState<"driving" | "resting" | "waiting">("waiting")

  const renderPage = () => {
    switch (currentPage) {
      case "history":
        return <HistoryPage />
      case "map":
        return <FleetMapPage />
      case "profile":
        return <ProfilePage isOnline={isOnline} setIsOnline={setIsOnline} />
      default:
        return (
          <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
            <StatusCard status={driverStatus} setStatus={setDriverStatus} />
            <QuickActions onActionClick={setActiveModal} />
            <RecentHistory />
          </main>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header driverName="Carlos" truckId="Volvo FH-10" isOnline={isOnline} />

      {renderPage()}

      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Modals */}
      <LogFuelModal open={activeModal === "fuel"} onClose={() => setActiveModal(null)} />
      <ReportIncidentModal open={activeModal === "incident"} onClose={() => setActiveModal(null)} />
      <ExpensesModal open={activeModal === "expenses"} onClose={() => setActiveModal(null)} />
      <ChecklistModal open={activeModal === "checklist"} onClose={() => setActiveModal(null)} />
    </div>
  )
}
