"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (data.username === "admin" && data.password === "HamousEbOunc") {
        localStorage.setItem("adminLoggedIn", "true");
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao painel de administração.",
        });
        onLogin();
      } else {
        form.setError("password", {
          type: "manual",
          message: "Nome de usuário ou senha incorretos",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Área do Administrador</CardTitle>
        <CardDescription>
          Faça login para acessar o painel de administração.
        </CardDescription>
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
                    <Input
                      placeholder="Digite seu nome de usuário"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
