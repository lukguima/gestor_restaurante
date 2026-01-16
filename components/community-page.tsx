"use client"

import { useState } from "react"
import {
  Search,
  MessageSquare,
  ThumbsUp,
  Users,
  TrendingUp,
  Clock,
  Filter,
  Plus,
  CheckCircle2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const discussions = [
  {
    id: 1,
    title: "Como organizar projetos React de grande escala?",
    author: "Carlos Mendes",
    avatar: "CM",
    category: "Desenvolvimento",
    replies: 24,
    views: 342,
    likes: 56,
    time: "há 2h",
    solved: true,
  },
  {
    id: 2,
    title: "Dúvida sobre autenticação com Next.js 14",
    author: "Ana Paula",
    avatar: "AP",
    category: "Desenvolvimento",
    replies: 18,
    views: 189,
    likes: 23,
    time: "há 4h",
    solved: false,
  },
  {
    id: 3,
    title: "Melhores práticas de UX para e-commerce",
    author: "Mariana Lima",
    avatar: "ML",
    category: "Design",
    replies: 31,
    views: 456,
    likes: 78,
    time: "há 6h",
    solved: true,
  },
  {
    id: 4,
    title: "Como monetizar conteúdo digital em 2024?",
    author: "Roberto Silva",
    avatar: "RS",
    category: "Marketing",
    replies: 42,
    views: 892,
    likes: 134,
    time: "há 1d",
    solved: false,
  },
  {
    id: 5,
    title: "Feedback sobre meu primeiro projeto do curso",
    author: "Julia Santos",
    avatar: "JS",
    category: "Geral",
    replies: 15,
    views: 203,
    likes: 45,
    time: "há 1d",
    solved: false,
  },
]

const topContributors = [
  { name: "Carlos Mendes", points: 2450, avatar: "CM", badge: "Expert" },
  { name: "Ana Paula", points: 2180, avatar: "AP", badge: "Mentor" },
  { name: "Mariana Lima", points: 1920, avatar: "ML", badge: "Top Voice" },
  { name: "Roberto Silva", points: 1650, avatar: "RS", badge: "Colaborador" },
  { name: "Julia Santos", points: 1420, avatar: "JS", badge: "Ativo" },
]

export function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Comunidade</h1>
          <p className="text-muted-foreground mt-1">Conecte-se, aprenda e compartilhe com outros alunos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Nova Discussão
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Membros", value: "12.4k", icon: Users },
          { label: "Discussões", value: "3.2k", icon: MessageSquare },
          { label: "Respostas Hoje", value: "156", icon: TrendingUp },
          { label: "Online Agora", value: "234", icon: Clock },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Discussions List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar discussões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="border-border text-foreground bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="bg-secondary">
              <TabsTrigger value="recent" className="data-[state=active]:bg-card">
                Recentes
              </TabsTrigger>
              <TabsTrigger value="popular" className="data-[state=active]:bg-card">
                Populares
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="data-[state=active]:bg-card">
                Sem Resposta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-4 space-y-3">
              {discussions.map((discussion) => (
                <Card
                  key={discussion.id}
                  className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-secondary text-foreground">{discussion.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {discussion.title}
                            </h3>
                            {discussion.solved && (
                              <Badge className="bg-primary/10 text-primary border-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Resolvido
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{discussion.author}</span>
                            <span className="text-muted-foreground">•</span>
                            <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                              {discussion.category}
                            </Badge>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{discussion.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {discussion.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {discussion.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="popular" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">Carregando discussões populares...</div>
            </TabsContent>

            <TabsContent value="unanswered" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">Carregando discussões sem resposta...</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Contribuidores
            </h3>
            <div className="space-y-4">
              {topContributors.map((contributor, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground">{contributor.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{contributor.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                        {contributor.badge}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{contributor.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Categories */}
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">Categorias</h3>
            <div className="space-y-2">
              {[
                { name: "Desenvolvimento", count: 1240, color: "bg-blue-500" },
                { name: "Design", count: 856, color: "bg-pink-500" },
                { name: "Marketing", count: 623, color: "bg-orange-500" },
                { name: "Negócios", count: 412, color: "bg-green-500" },
                { name: "Geral", count: 289, color: "bg-purple-500" },
              ].map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${cat.color}`} />
                    <span className="text-sm text-foreground">{cat.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
