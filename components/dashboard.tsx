"use client"

import { Play, Clock, TrendingUp, Award, BookOpen, ChevronRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import type { Page, Course, Lesson } from "@/components/course-platform"
import { coursesData } from "@/lib/courses-data"

interface DashboardProps {
  setCurrentPage: (page: Page) => void
  onOpenLesson: (course: Course, lesson: Lesson) => void
}

const stats = [
  { label: "Cursos Ativos", value: "5", icon: BookOpen, color: "text-primary" },
  { label: "Horas Estudadas", value: "47", icon: Clock, color: "text-blue-400" },
  { label: "Sequência", value: "12 dias", icon: Flame, color: "text-orange-400" },
  { label: "Certificados", value: "3", icon: Award, color: "text-yellow-400" },
]

const recentActivity = [
  { user: "Ana Silva", action: "completou o módulo", target: "React Avançado", time: "há 2h", avatar: "AS" },
  { user: "Carlos M.", action: "comentou em", target: "Dúvida sobre hooks", time: "há 3h", avatar: "CM" },
  { user: "Mariana L.", action: "conquistou", target: "Primeira Certificação", time: "há 5h", avatar: "ML" },
]

export function Dashboard({ setCurrentPage, onOpenLesson }: DashboardProps) {
  const continueWatching = coursesData.filter((c) => c.progress > 0 && c.progress < 100).slice(0, 3)

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Olá, João Pedro! 👋</h1>
          <p className="text-muted-foreground mt-1">Continue sua jornada de aprendizado</p>
        </div>
        <Button
          onClick={() => setCurrentPage("courses")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Explorar Cursos
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue Watching */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Continuar Assistindo</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage("courses")}
            className="text-primary hover:text-primary/80"
          >
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {continueWatching.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => {
                const nextLesson = course.modules[0]?.lessons.find((l) => !l.completed) || course.modules[0]?.lessons[0]
                if (nextLesson) onOpenLesson(course, nextLesson)
              }}
            >
              <div className="relative aspect-video">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary-foreground fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{course.category}</span>
                <h3 className="font-semibold text-foreground mt-1 line-clamp-1">{course.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {course.completedLessons}/{course.totalLessons} aulas
                  </span>
                  <span className="text-xs font-medium text-primary">{course.progress}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progresso Semanal
          </h3>
          <div className="space-y-4">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, i) => {
              const hours = [2, 1.5, 3, 2.5, 1, 4, 3][i]
              const percentage = (hours / 4) * 100
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-8 text-sm text-muted-foreground">{day}</span>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-foreground text-right">{hours}h</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Community Activity */}
        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Atividade da Comunidade</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-foreground text-xs">{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="text-primary">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-4 text-primary hover:text-primary/80"
            onClick={() => setCurrentPage("community")}
          >
            Ver Comunidade
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
