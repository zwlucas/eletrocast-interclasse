"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFormStore } from "@/store/form-store";
import {
  representativeSchema,
  type RepresentativeFormData,
} from "@/lib/validations";
import { verifyRepresentative } from "@/app/actions";
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

export function RepresentativeForm() {
  const { rm, nome, setRepresentativeData, nextStep } = useFormStore();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<RepresentativeFormData>({
    resolver: zodResolver(representativeSchema),
    defaultValues: {
      rm: rm || "",
      nome: nome || "",
    },
  });

  const onSubmit = async (data: RepresentativeFormData) => {
    setIsVerifying(true);
    try {
      const result = await verifyRepresentative(data.rm);

      if (!result.success) {
        form.setError("rm", {
          type: "manual",
          message:
            "RM não encontrado. Verifique se você está autorizado a fazer inscrições.",
        });
        return;
      }

      const representativeData = {
        rm: data.rm,
        nome: data.nome,
        ano: result.data.ano,
        curso: result.data.curso,
      };

      setRepresentativeData(representativeData);
      nextStep();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o RM. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verificação do Representante</CardTitle>
        <CardDescription>
          Informe seu RM e nome para verificar se você está autorizado a fazer
          inscrições.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RM do Representante</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu RM" {...field} />
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
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? "Verificando..." : "Continuar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
