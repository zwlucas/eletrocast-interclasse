"use client";

import { useFormStore } from "@/store/form-store";
import { Stepper } from "@/components/stepper";
import { RepresentativeForm } from "@/components/step-1-representative";
import { ConfirmationForm } from "@/components/step-2-confirmation";
import { ModalityPlayersForm } from "@/components/step-3-modality-players";
import { ThankYouPage } from "@/components/step-4-thank-you";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function InscricaoPage() {
  const { currentStep, initForm } = useFormStore();

  useEffect(() => {
    initForm();
  }, [initForm]);

  const steps = [
    "Verificação",
    "Confirmação",
    "Modalidade e Jogadoras",
    "Concluído",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RepresentativeForm />;
      case 2:
        return <ConfirmationForm />;
      case 3:
        return <ModalityPlayersForm />;
      case 4:
        return <ThankYouPage />;
      default:
        return <RepresentativeForm />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/" passHref>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para a página inicial
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">
              Inscrição Interclasse
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Preencha o formulário para inscrever seu time no Interclasse.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <Stepper currentStep={currentStep} steps={steps} />
          </div>

          {renderStep()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
