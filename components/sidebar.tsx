"use client"

import {
  Home,
  BookOpen,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Play,
  Trophy,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Page } from "@/components/course-platform"

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const menuItems = [
  { id: "dashboard" as Page, label: "Início", icon: Home },
  { id: "courses" as Page, label: "Meus Cursos", icon: BookOpen },
  { id: "community" as Page, label: "Comunidade", icon: Users },
  { id: "profile" as Page, label: "Meu Perfil", icon: User },
]

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
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
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground">Academia</span>
              <span className="text-xs text-primary">PRO</span>
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
        </nav>

        {/* Stats */}
        {isOpen && (
          <div className="p-4 mx-3 mb-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Seu Progresso</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cursos completos</span>
                <span className="text-foreground font-medium">3/8</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[37%] bg-primary rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-3 border-t border-border">
          <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback className="bg-secondary text-foreground">JP</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">João Pedro</p>
                <p className="text-xs text-muted-foreground truncate">Membro Premium</p>
              </div>
            )}
          </div>
          {isOpen && (
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Toggle Button - Desktop only */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card hidden md:flex"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
      </aside>
    </>
  )
}
