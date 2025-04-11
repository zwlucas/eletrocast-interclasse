"use client";

import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function ThankYouPage() {
  const { modalidade, categoria, resetForm } = useFormStore();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const getModalidadeLabel = () => {
    const modalidadeMap = {
      volei: "Vôlei",
      handebol: "Handebol",
      futsal: "Futsal",
    };

    const categoriaMap = {
      feminino: "Feminino",
      masculino: "Masculino",
    };

    const modalidadeLabel =
      modalidadeMap[modalidade as keyof typeof modalidadeMap] || "";
    const categoriaLabel =
      categoriaMap[categoria as keyof typeof categoriaMap] || "";

    return `${modalidadeLabel} ${categoriaLabel}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-2xl">
          Inscrição Enviada com Sucesso! 🎉
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">
          Inscrição enviada com sucesso para a modalidade{" "}
          <strong>{getModalidadeLabel()}</strong>!
        </p>
        <p className="text-lg">Boa sorte no Interclasse! 🎉</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/" passHref>
          <Button onClick={resetForm}>Fazer Nova Inscrição</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
