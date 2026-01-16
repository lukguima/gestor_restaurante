"use client"

import { User, Settings, Bell, Shield, Truck, MapPin, Calendar, Phone, Mail, ChevronRight, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface ProfilePageProps {
  isOnline: boolean
  setIsOnline: (value: boolean) => void
}

const stats = [
  { label: "Viagens", value: "234" },
  { label: "Km Total", value: "45.2K" },
  { label: "Avaliação", value: "4.9" },
]

const menuItems = [
  { icon: Bell, label: "Notificações", badge: "3" },
  { icon: Shield, label: "Segurança" },
  { icon: Truck, label: "Meu Veículo" },
  { icon: Settings, label: "Configurações" },
]

export function ProfilePage({ isOnline, setIsOnline }: ProfilePageProps) {
  return (
    <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      {/* Profile Header */}
      <Card className="mb-6 border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src="/truck-driver-portrait.png" />
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">CS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Carlos Santos</h1>
                <Badge className="bg-primary/10 text-primary">Motorista</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Volvo FH-10 • Desde 2019</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-secondary/50 p-3 text-center">
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="mb-6 border-border">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium text-foreground">(11) 98765-4321</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">carlos.santos@email.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Base</p>
              <p className="font-medium text-foreground">São Paulo, SP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">CNH Válida até</p>
              <p className="font-medium text-foreground">15/08/2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connectivity Toggle */}
      <Card className="mb-6 border-border">
        <CardContent className="flex min-h-[60px] items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                isOnline ? "bg-emerald-500/10" : "bg-destructive/10",
              )}
            >
              <User className={cn("h-5 w-5", isOnline ? "text-emerald-500" : "text-destructive")} />
            </div>
            <div>
              <p className="font-medium text-foreground">Status de Conectividade</p>
              <p className="text-sm text-muted-foreground">
                {isOnline ? "Online - Sincronizado" : "Offline - Pendente"}
              </p>
            </div>
          </div>
          <Switch checked={isOnline} onCheckedChange={setIsOnline} />
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="mb-6 border-border">
        <CardContent className="divide-y divide-border p-0">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className="flex min-h-[56px] w-full items-center justify-between p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && <Badge className="bg-primary text-primary-foreground">{item.badge}</Badge>}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-destructive/30">
        <CardContent className="p-0">
          <button className="flex min-h-[56px] w-full items-center justify-center gap-2 p-4 text-destructive transition-colors hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sair da Conta</span>
          </button>
        </CardContent>
      </Card>
    </main>
  )
}
