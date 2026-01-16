"use client"

import { useState } from "react"
import { Search, Filter, Play, Clock, Star, ChevronDown, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Course, Lesson } from "@/components/course-platform"
import { coursesData } from "@/lib/courses-data"

interface CoursesPageProps {
  onOpenLesson: (course: Course, lesson: Lesson) => void
}

const categories = ["Todos", "Desenvolvimento", "Design", "Marketing", "Negócios"]

export function CoursesPage({ onOpenLesson }: CoursesPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Meus Cursos</h1>
        <p className="text-muted-foreground mt-1">Acesse todos os seus cursos e continue aprendendo</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border text-foreground bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              {selectedCategory}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="text-foreground hover:bg-secondary focus:bg-secondary"
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border text-muted-foreground hover:text-foreground"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <Image
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{course.category}</Badge>
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-lg">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.totalLessons} aulas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.ceil(course.totalLessons * 0.5)}h
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  4.9
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-sm text-muted-foreground">{course.instructor}</span>
              </div>

              {/* Progress or Start */}
              <div className="mt-4">
                {course.progress > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="text-primary font-medium">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      const firstLesson = course.modules[0]?.lessons[0]
                      if (firstLesson) onOpenLesson(course, firstLesson)
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Começar Curso
                  </Button>
                )}
              </div>

              {/* Expandable Modules */}
              {course.progress > 0 && (
                <Accordion
                  type="single"
                  collapsible
                  className="mt-4"
                  value={expandedCourse === course.id ? "modules" : ""}
                  onValueChange={(val) => setExpandedCourse(val ? course.id : null)}
                >
                  <AccordionItem value="modules" className="border-border">
                    <AccordionTrigger className="text-sm text-foreground hover:text-primary py-2">
                      Ver módulos ({course.modules.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {course.modules.map((module) => (
                          <div key={module.id}>
                            <p className="text-xs font-medium text-muted-foreground mb-1">{module.title}</p>
                            {module.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => onOpenLesson(course, lesson)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                              >
                                <div
                                  className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                    lesson.completed
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  <Play className="h-3 w-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm truncate ${
                                      lesson.completed ? "text-muted-foreground" : "text-foreground"
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                </div>
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground mt-1">Tente ajustar seus filtros</p>
        </div>
      )}
    </div>
  )
}
