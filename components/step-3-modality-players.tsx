"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFormStore } from "@/store/form-store";
import {
  modalidadeJogadoresSchema,
  type ModalidadeJogadoresFormData,
} from "@/lib/validations";
import { submitRegistration } from "@/app/actions";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export function ModalityPlayersForm() {
  const {
    rm,
    nome,
    ano,
    curso,
    modalidade,
    categoria,
    jogadores,
    setModalidade,
    setCategoria,
    setJogadores,
    nextStep,
    prevStep,
  } = useFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ModalidadeJogadoresFormData>({
    resolver: zodResolver(modalidadeJogadoresSchema),
    defaultValues: {
      modalidade: modalidade || undefined,
      categoria: categoria || undefined,
      jogadores: jogadores.length
        ? jogadores
        : Array(12).fill({ nome: "", capitao: false }),
    },
  });

  const onSubmit = async (data: ModalidadeJogadoresFormData) => {
    setIsSubmitting(true);
    try {
      setModalidade(data.modalidade);
      setCategoria(data.categoria);
      setJogadores(data.jogadores);

      const formData = {
        rm,
        nome,
        ano,
        curso,
        modalidade: data.modalidade,
        categoria: data.categoria,
        jogadores: data.jogadores,
        currentStep: 3,
      };

      const result = await submitRegistration(formData);

      if (!result.success) {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      nextStep();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapitaoChange = (index: number) => {
    const updatedJogadores = form.getValues().jogadores.map((jogador, i) => ({
      ...jogador,
      capitao: i === index,
    }));

    form.setValue("jogadores", updatedJogadores, { shouldValidate: true });
  };

  const handleNomeChange = (index: number, value: string) => {
    const updatedJogadores = [...form.getValues().jogadores];
    updatedJogadores[index] = {
      ...updatedJogadores[index],
      nome: value,
    };

    form.setValue("jogadores", updatedJogadores, { shouldValidate: true });
  };

  const modalidades = [
    { value: "futsal", label: "Futsal" },
    { value: "volei", label: "Vôlei" },
    { value: "handebol", label: "Handebol" },
  ];

  const categorias = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
  ];

  const selectedCategoria = form.watch("categoria");

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Modalidade e Jogadores</CardTitle>
        <CardDescription>
          Selecione a modalidade, categoria e informe os jogadores do time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modalidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modalidades.map((modalidade) => (
                          <SelectItem
                            key={modalidade.value}
                            value={modalidade.value}
                          >
                            {modalidade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem
                            key={categoria.value}
                            value={categoria.value}
                          >
                            {categoria.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                {selectedCategoria === "feminino"
                  ? "Jogadoras"
                  : selectedCategoria === "masculino"
                  ? "Jogadores"
                  : "Jogadores/as"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Informe o nome dos 12{" "}
                {selectedCategoria === "feminino"
                  ? "jogadoras"
                  : selectedCategoria === "masculino"
                  ? "jogadores"
                  : "jogadores/as"}{" "}
                e selecione{" "}
                {selectedCategoria === "feminino"
                  ? "uma capitã"
                  : selectedCategoria === "masculino"
                  ? "um capitão"
                  : "um/a capitão/ã"}
                .
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 mb-2">
                  <div className="col-span-8 font-medium">
                    Nome do{" "}
                    {selectedCategoria === "feminino"
                      ? "Jogadora"
                      : selectedCategoria === "masculino"
                      ? "Jogador"
                      : "Jogador/a"}
                  </div>
                  <div className="col-span-4 font-medium">
                    {selectedCategoria === "feminino"
                      ? "Capitã"
                      : selectedCategoria === "masculino"
                      ? "Capitão"
                      : "Capitão/ã"}
                  </div>
                </div>

                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-8">
                      <Input
                        placeholder={`Nome ${
                          selectedCategoria === "feminino"
                            ? "da jogadora"
                            : selectedCategoria === "masculino"
                            ? "do jogador"
                            : "do/a jogador/a"
                        } ${index + 1}`}
                        value={form.watch(`jogadores.${index}.nome`)}
                        onChange={(e) =>
                          handleNomeChange(index, e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <RadioGroup
                        value={
                          form.watch(`jogadores.${index}.capitao`)
                            ? index.toString()
                            : undefined
                        }
                        onValueChange={(value) =>
                          handleCapitaoChange(Number.parseInt(value))
                        }
                        className="flex justify-center"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`capitao-${index}`}
                        />
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>

              {form.formState.errors.jogadores && (
                <p className="text-sm font-medium text-red-500 mt-2">
                  {form.formState.errors.jogadores.message}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep}>
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
