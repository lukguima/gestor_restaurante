"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { CoursesPage } from "@/components/courses-page"
import { CommunityPage } from "@/components/community-page"
import { LessonPlayer } from "@/components/lesson-player"
import { ProfilePage } from "@/components/profile-page"

export type Page = "dashboard" | "courses" | "community" | "lesson" | "profile"

export interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  videoUrl?: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  thumbnail: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  modules: Module[]
}

export function CoursePlatform() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const handleOpenLesson = (course: Course, lesson: Lesson) => {
    setSelectedCourse(course)
    setSelectedLesson(lesson)
    setCurrentPage("lesson")
  }

  const handleBackFromLesson = () => {
    setCurrentPage("courses")
    setSelectedLesson(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        {currentPage === "dashboard" && <Dashboard setCurrentPage={setCurrentPage} onOpenLesson={handleOpenLesson} />}
        {currentPage === "courses" && <CoursesPage onOpenLesson={handleOpenLesson} />}
        {currentPage === "community" && <CommunityPage />}
        {currentPage === "profile" && <ProfilePage />}
        {currentPage === "lesson" && selectedCourse && selectedLesson && (
          <LessonPlayer course={selectedCourse} lesson={selectedLesson} onBack={handleBackFromLesson} />
        )}
      </main>
    </div>
  )
}
