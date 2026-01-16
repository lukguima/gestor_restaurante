"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  Share2,
  BookOpen,
  Clock,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import type { Course, Lesson } from "@/components/course-platform"

interface LessonPlayerProps {
  course: Course
  lesson: Lesson
  onBack: () => void
}

export function LessonPlayer({ course, lesson, onBack }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [volume, setVolume] = useState(80)

  // Find current lesson index and get prev/next
  const allLessons = course.modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player */}
      <div className="relative bg-black">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Video Area */}
        <div className="aspect-video max-h-[70vh] flex items-center justify-center bg-gradient-to-br from-secondary to-background">
          <div
            className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-primary-foreground" />
            ) : (
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            )}
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              onValueChange={([val]) => setProgress(val)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <SkipForward className="h-5 w-5" />
              </Button>
              <span className="text-sm text-white ml-2">
                {Math.floor(progress * 0.15)}:{String(Math.floor(((progress * 0.15) % 1) * 60)).padStart(2, "0")} /
                15:30
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-white" />
              <Slider value={[volume]} onValueChange={([val]) => setVolume(val)} max={100} step={1} className="w-24" />
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Video */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Info */}
            <div>
              <div className="flex items-center gap-2 text-sm text-primary mb-2">
                <span>{course.category}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{course.title}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{lesson.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground">
                      {course.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">Instrutor</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Aula {currentIndex + 1} de {allLessons.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Marcar como Concluída
              </Button>
              <Button variant="outline" className="border-border text-foreground bg-transparent">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Útil
              </Button>
              <Button variant="outline" className="border-border text-foreground bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-secondary">
                <TabsTrigger value="about" className="data-[state=active]:bg-card">
                  Sobre
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-card">
                  Comentários
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-card">
                  Recursos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-3">Sobre esta aula</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nesta aula, você aprenderá conceitos fundamentais que serão essenciais para seu desenvolvimento
                    profissional. Vamos abordar as melhores práticas do mercado e exemplos práticos que você poderá
                    aplicar imediatamente em seus projetos.
                  </p>
                  <h4 className="font-semibold text-foreground mt-6 mb-3">O que você vai aprender:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      Fundamentos teóricos e práticos do tema
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      Aplicações no mundo real
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      Dicas e truques avançados
                    </li>
                  </ul>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-4">Discussão (24 comentários)</h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Deixe seu comentário ou dúvida..."
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Comentar
                    </Button>
                  </div>

                  {/* Sample Comments */}
                  <div className="mt-6 space-y-4">
                    {[
                      {
                        name: "Maria Santos",
                        time: "há 2 dias",
                        comment: "Excelente explicação! Finalmente entendi esse conceito.",
                        likes: 12,
                      },
                      {
                        name: "Pedro Costa",
                        time: "há 3 dias",
                        comment: "Alguém pode me ajudar com a parte dos 5:30? Não entendi muito bem.",
                        likes: 3,
                      },
                    ].map((c, i) => (
                      <div key={i} className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-secondary text-foreground text-sm">
                            {c.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{c.comment}</p>
                          <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground hover:text-primary">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            {c.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-4">Materiais de Apoio</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Slides da Aula.pdf", size: "2.4 MB" },
                      { name: "Código Fonte.zip", size: "156 KB" },
                      { name: "Exercícios Práticos.pdf", size: "890 KB" },
                    ].map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Course Content */}
          <div className="space-y-4">
            <Card className="p-4 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">Conteúdo do Curso</h3>
              <div className="space-y-3">
                {course.modules.map((module, mi) => (
                  <div key={module.id}>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Módulo {mi + 1}: {module.title}
                    </p>
                    <div className="space-y-1">
                      {module.lessons.map((l, li) => {
                        const isCurrentLesson = l.id === lesson.id
                        return (
                          <button
                            key={l.id}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                              isCurrentLesson ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary"
                            }`}
                          >
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                l.completed
                                  ? "bg-primary text-primary-foreground"
                                  : isCurrentLesson
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {l.completed ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">{li + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm truncate ${
                                  isCurrentLesson ? "text-primary font-medium" : "text-foreground"
                                }`}
                              >
                                {l.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{l.duration}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex gap-2">
              {prevLesson && (
                <Button variant="outline" className="flex-1 border-border text-foreground bg-transparent">
                  <SkipBack className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              {nextLesson && (
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Próxima
                  <SkipForward className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
