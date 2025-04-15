"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { UserPlus, Trash2, Search } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"
import { adicionarRepresentante, removerRepresentante } from "@/app/actions/representatives"

// Schema para validação do formulário de novo representante
const novoRepresentanteSchema = z.object({
  rm: z.string().min(1, "O RM é obrigatório"),
  nome: z.string().min(3, "O nome completo é obrigatório"),
  ano: z.string().min(1, "O ano é obrigatório"),
  curso: z.string().min(1, "O curso é obrigatório"),
})

type NovoRepresentanteFormData = z.infer<typeof novoRepresentanteSchema>

export function ManageRepresentatives() {
  const [representantes, setRepresentantes] = useState<any[]>([])
  const [filteredRepresentantes, setFilteredRepresentantes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const form = useForm<NovoRepresentanteFormData>({
    resolver: zodResolver(novoRepresentanteSchema),
    defaultValues: {
      rm: "",
      nome: "",
      ano: "",
      curso: "",
    },
  })

  // Carregar lista de representantes ao montar o componente
  useEffect(() => {
    fetchRepresentantes()
  }, [])

  useEffect(() => {
    filterRepresentantes()
  }, [representantes, searchTerm])

  // Função para buscar os representantes
  const fetchRepresentantes = async () => {
    setIsLoading(true)
    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase
        .from("representantes_autorizados")
        .select("*")
        .order("data_cadastro", { ascending: false })

      if (error) {
        throw error
      }

      setRepresentantes(data || [])
      setFilteredRepresentantes(data || [])
    } catch (error) {
      console.error("Erro ao listar representantes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de representantes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para filtrar representantes
  const filterRepresentantes = () => {
    if (!searchTerm) {
      setFilteredRepresentantes(representantes)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = representantes.filter(
      (rep) =>
        rep.nome.toLowerCase().includes(term) ||
        rep.rm.toLowerCase().includes(term) ||
        rep.ano.toLowerCase().includes(term) ||
        rep.curso.toLowerCase().includes(term),
    )
    setFilteredRepresentantes(filtered)
  }

  // Função para adicionar um novo representante
  const onSubmit = async (data: NovoRepresentanteFormData) => {
    setIsSubmitting(true)
    try {
      const result = await adicionarRepresentante(data)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Representante adicionado com sucesso",
        })
        form.reset()
        setIsDialogOpen(false)
        await fetchRepresentantes() // Atualizar a lista
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar representante:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o representante",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para remover um representante
  const handleRemoveRepresentante = async (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este representante?")) {
      try {
        const result = await removerRepresentante(id)
        if (result.success) {
          toast({
            title: "Sucesso",
            description: "Representante removido com sucesso",
          })
          await fetchRepresentantes() // Atualizar a lista
        } else {
          toast({
            title: "Erro",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao remover representante:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao remover o representante",
          variant: "destructive",
        })
      }
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return "Desconhecida"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Gerenciar Representantes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Adicione ou remova representantes autorizados a fazer inscrições
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Representante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Representante</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para autorizar um novo representante a fazer inscrições.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RM</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o RM do representante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1º, 2º, 3º" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="curso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Informática, Administração" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Adicionando..." : "Adicionar Representante"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Representantes Autorizados</CardTitle>
          <CardDescription>Todos os representantes autorizados a fazer inscrições no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, RM, ano ou curso..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8 dark:text-gray-300">Carregando representantes...</div>
          ) : filteredRepresentantes.length === 0 ? (
            <div className="text-center py-8 dark:text-gray-300">Nenhum representante encontrado.</div>
          ) : (
            <div className="rounded-md border dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RM</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepresentantes.map((representante) => (
                    <TableRow key={representante.id}>
                      <TableCell className="font-medium">{representante.rm}</TableCell>
                      <TableCell>{representante.nome}</TableCell>
                      <TableCell>{representante.ano}</TableCell>
                      <TableCell>{representante.curso}</TableCell>
                      <TableCell>{formatDate(representante.data_cadastro)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleRemoveRepresentante(representante.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
