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
import { Badge } from "@/components/ui/badge"
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
import { UserPlus, Trash2 } from "lucide-react"
import { criarAdministrador, listarAdministradores, removerAdministrador } from "@/lib/auth"

// Schema para validação do formulário de novo administrador
const novoAdminSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  nome_completo: z.string().min(3, "O nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
})

type NovoAdminFormData = z.infer<typeof novoAdminSchema>

export function ManageAdmins() {
  const [admins, setAdmins] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NovoAdminFormData>({
    resolver: zodResolver(novoAdminSchema),
    defaultValues: {
      username: "",
      password: "",
      nome_completo: "",
      email: "",
    },
  })

  // Carregar lista de administradores ao montar o componente
  useEffect(() => {
    fetchAdmins()
  }, [])

  // Função para buscar os administradores
  const fetchAdmins = async () => {
    setIsLoading(true)
    try {
      const result = await listarAdministradores()
      if (result.success) {
        setAdmins(result.administradores)
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de administradores",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao listar administradores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para criar um novo administrador
  const onSubmit = async (data: NovoAdminFormData) => {
    setIsSubmitting(true)
    try {
      const result = await criarAdministrador(data)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Administrador criado com sucesso",
        })
        form.reset()
        setIsDialogOpen(false)
        await fetchAdmins() // Atualizar a lista
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao criar administrador:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o administrador",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para remover um administrador
  const handleRemoveAdmin = async (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este administrador?")) {
      try {
        const result = await removerAdministrador(id)
        if (result.success) {
          toast({
            title: "Sucesso",
            description: "Administrador removido com sucesso",
          })
          await fetchAdmins() // Atualizar a lista
        } else {
          toast({
            title: "Erro",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao remover administrador:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao remover o administrador",
          variant: "destructive",
        })
      }
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return "Nunca"
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
          <h2 className="text-2xl font-bold dark:text-white">Gerenciar Administradores</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Adicione ou remova usuários do painel administrativo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Administrador</DialogTitle>
              <DialogDescription>Preencha os campos abaixo para criar um novo acesso administrativo.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome de usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite a senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nome_completo"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite o email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Criando..." : "Criar Administrador"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Administradores</CardTitle>
          <CardDescription>Todos os usuários com acesso administrativo ao sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 dark:text-gray-300">Carregando administradores...</div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 dark:text-gray-300">Nenhum administrador encontrado.</div>
          ) : (
            <div className="rounded-md border dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome de Usuário</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.username}</TableCell>
                      <TableCell>{admin.nome_completo}</TableCell>
                      <TableCell>{admin.email || "—"}</TableCell>
                      <TableCell>
                        {admin.is_master ? (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800"
                          >
                            Master
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
                          >
                            Admin
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(admin.data_criacao)}</TableCell>
                      <TableCell>{admin.ultimo_login ? formatDate(admin.ultimo_login) : "Nunca"}</TableCell>
                      <TableCell>
                        {!admin.is_master && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleRemoveAdmin(admin.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
