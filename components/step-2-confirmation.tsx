"use client";

import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ConfirmationForm() {
  const { rm, nome, ano, curso, nextStep, prevStep } = useFormStore();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Confirmação dos Dados</CardTitle>
        <CardDescription>
          Verifique se os dados estão corretos antes de continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              RM
            </h3>
            <p className="mt-1 text-lg dark:text-white">{rm}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nome
            </h3>
            <p className="mt-1 text-lg dark:text-white">{nome}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ano
            </h3>
            <p className="mt-1 text-lg dark:text-white">{ano}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Curso
            </h3>
            <p className="mt-1 text-lg dark:text-white">{curso}</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Os dados de ano e curso foram recuperados automaticamente do
            sistema. Se houver alguma inconsistência, entre em contato com a
            coordenação.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button onClick={nextStep}>Confirmar e Continuar</Button>
      </CardFooter>
    </Card>
  );
}
