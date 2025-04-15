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
import { alterarSenha } from "@/lib/auth"

// Schema para validação do formulário de troca de senha
const senhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "A senha atual é obrigatória"),
    novaSenha: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "A confirmação da senha é obrigatória"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

type SenhaFormData = z.infer<typeof senhaSchema>

interface ChangePasswordProps {
  adminId: number
}

export function ChangePassword({ adminId }: ChangePasswordProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SenhaFormData>({
    resolver: zodResolver(senhaSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  })

  const onSubmit = async (data: SenhaFormData) => {
    setIsSubmitting(true)
    try {
      const result = await alterarSenha(adminId, data.senhaAtual, data.novaSenha)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso",
        })
        form.reset()
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar a senha",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Digite sua senha atual e defina uma nova senha para sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="senhaAtual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha atual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="novaSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua nova senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirme sua nova senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
