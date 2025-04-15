"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { verificarCredenciais } from "@/lib/auth"

const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await verificarCredenciais(data.username, data.password)

      if (result.success) {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao painel de administração.",
        })
        // Adicionar um pequeno atraso antes de chamar onLogin para garantir que o estado seja atualizado
        setTimeout(() => {
          onLogin()
        }, 100)
      } else {
        form.setError("password", {
          type: "manual",
          message: result.message || "Nome de usuário ou senha incorretos",
        })
        console.error("Falha no login:", result.message)
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Área do Administrador</CardTitle>
        <CardDescription>Faça login para acessar o painel de administração.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome de usuário" {...field} />
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
                    <Input type="password" placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            {form.formState.isSubmitSuccessful && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Se o painel não carregar automaticamente, clique no botão abaixo:
                </p>
                <Button type="button" variant="outline" onClick={() => window.location.reload()} className="mx-auto">
                  Recarregar Página
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
