import { z } from "zod"

// Step 1: Representative verification schema
export const representativeSchema = z.object({
  rm: z.string().min(1, "RM é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
})

// Step 3: Modality and players schema
export const jogadorSchema = z.object({
  nome: z.string().min(1, "Nome do jogador é obrigatório"),
  capitao: z.boolean(),
})

export const modalidadeJogadoresSchema = z.object({
  modalidade: z.enum(["volei", "handebol", "futsal"], {
    errorMap: () => ({ message: "Selecione uma modalidade" }),
  }),
  categoria: z.enum(["feminino", "masculino"], {
    errorMap: () => ({ message: "Selecione uma categoria" }),
  }),
  jogadores: z
    .array(jogadorSchema)
    .min(5, "É necessário informar no mínimo 5 jogadores/as")
    .max(12, "É permitido no máximo 12 jogadores/as")
    .refine((jogadores) => jogadores.filter((j) => j.nome.trim() !== "").length >= 5, {
      message: "É necessário informar no mínimo 5 jogadores/as",
    })
    .refine((jogadores) => jogadores.every((jogador) => jogador.nome.trim() !== ""), {
      message: "Todos os nomes dos jogadores/as devem ser preenchidos",
    })
    .refine(
      (jogadores) => {
        const nomes = jogadores.map((jogador) => jogador.nome.trim().toLowerCase())
        return new Set(nomes).size === nomes.length
      },
      {
        message: "Não são permitidos nomes duplicados",
      },
    )
    .refine((jogadores) => jogadores.filter((jogador) => jogador.capitao).length === 1, {
      message: "É necessário selecionar exatamente um/a capitão/ã",
    }),
})

export type RepresentativeFormData = z.infer<typeof representativeSchema>
export type ModalidadeJogadoresFormData = z.infer<typeof modalidadeJogadoresSchema>
