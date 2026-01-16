"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, Settings, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: string
  name: string
  category: string
  price: number | string
  description: string
  image: string
}

const CATEGORIES = ['Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas']

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 600'%3E%3Crect fill='%23e2e8f0' width='800' height='600'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ESem Imagem%3C/text%3E%3C/svg%3E";

export function MenuBoard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Pratos Principais',
    price: '',
    description: '',
    image: ''
  })
  const [isEditingId, setIsEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = () => {
    setLoading(true)
    api.get('/menu')
      .then((data: MenuItem[]) => {
        setMenuItems(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditingId) {
        const saved = await api.put(`/menu/${isEditingId}`, editForm)
        setMenuItems(menuItems.map(item => item.id === isEditingId ? saved : item))
      } else {
        const newItem = { ...editForm, id: Date.now().toString() }
        const saved = await api.post('/menu', newItem)
        setMenuItems([...menuItems, saved])
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to save menu item", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(`/menu/${id}`)
        setMenuItems(menuItems.filter(item => item.id !== id))
      } catch (error) {
        console.error("Failed to delete menu item", error)
      }
    }
  }

  const startNew = () => {
    setIsEditingId(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const startEdit = (item: MenuItem) => {
    setIsEditingId(item.id)
    setEditForm(item)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditForm({ name: '', category: 'Pratos Principais', price: '', description: '', image: '' })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
  }

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Cardápio</h2>
        <Button onClick={startNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuItems.map(item => (
          <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-48 overflow-hidden bg-muted">
              {item.image ? (
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Note: onError on next/image is limited, but with unoptimized=true it behaves like img
                    const target = e.target as HTMLImageElement;
                    if (target.src !== PLACEHOLDER_IMAGE) {
                        target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem Imagem</div>
              )}
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                R$ {Number(item.price).toFixed(2)}
              </div>
            </div>
            <CardContent className="p-4 flex flex-col gap-2">
              <div>
                <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">{item.description}</p>
              
              <div className="flex justify-end gap-2 mt-2 pt-4 border-t">
                <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingId ? 'Editar Item' : 'Novo Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select 
                value={editForm.category} 
                onValueChange={val => setEditForm({...editForm, category: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço (R$)</label>
              <Input 
                type="number" 
                step="0.01" 
                value={editForm.price} 
                onChange={e => setEditForm({...editForm, price: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea 
                value={editForm.description} 
                onChange={e => setEditForm({...editForm, description: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL da Imagem</label>
              <Input 
                value={editForm.image} 
                onChange={e => setEditForm({...editForm, image: e.target.value})} 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
