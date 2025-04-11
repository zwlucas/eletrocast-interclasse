import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Jogador = {
  nome: string
  capitao: boolean
}

export type FormState = {
  // Step 1: Representative data
  rm: string
  nome: string
  ano: string
  curso: string

  // Step 2: No additional data, just confirmation

  // Step 3: Modality and players
  modalidade: "volei" | "handebol" | "futsal" | ""
  categoria: "feminino" | "masculino" | ""
  jogadores: Jogador[]

  // Current step
  currentStep: number
}

type FormActions = {
  setRepresentativeData: (data: Pick<FormState, "rm" | "nome" | "ano" | "curso">) => void
  setModalidade: (modalidade: FormState["modalidade"]) => void
  setCategoria: (categoria: FormState["categoria"]) => void
  setJogadores: (jogadores: Jogador[]) => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
  initForm: () => void
}

const initialState: FormState = {
  rm: "",
  nome: "",
  ano: "",
  curso: "",
  modalidade: "",
  categoria: "",
  jogadores: Array(12).fill({ nome: "", capitao: false }),
  currentStep: 1,
}

export const useFormStore = create<FormState & FormActions>()(
  persist(
    (set) => ({
      ...initialState,

      setRepresentativeData: (data) => set(data),

      setModalidade: (modalidade) => set({ modalidade }),

      setCategoria: (categoria) => set({ categoria }),

      setJogadores: (jogadores) => set({ jogadores }),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

      resetForm: () => set(initialState),

      initForm: () => set((state) => ({ ...state, currentStep: 1 })),
    }),
    {
      name: "interclasse-form",
    },
  ),
)
