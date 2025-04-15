"use server"

import { getServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Tipo para os dados do representante
export type RepresentanteData = {
  rm: string
  nome: string
  ano: string
  curso: string
}

// Função para adicionar um novo representante
export async function adicionarRepresentante(dados: RepresentanteData) {
  try {
    const supabase = getServerClient()

    // Verificar se o RM já existe
    const { data: existingRM } = await supabase
      .from("representantes_autorizados")
      .select("id")
      .eq("rm", dados.rm)
      .single()

    if (existingRM) {
      return { success: false, message: "Este RM já está cadastrado" }
    }

    const { error } = await supabase.from("representantes_autorizados").insert([
      {
        rm: dados.rm,
        nome: dados.nome,
        ano: dados.ano,
        curso: dados.curso,
      },
    ])

    if (error) {
      throw error
    }

    revalidatePath("/admin")
    return { success: true, message: "Representante adicionado com sucesso" }
  } catch (error) {
    console.error("Erro ao adicionar representante:", error)
    return { success: false, message: "Erro ao adicionar representante" }
  }
}

// Função para remover um representante
export async function removerRepresentante(id: number) {
  try {
    const supabase = getServerClient()

    // Verificar se existem inscrições associadas a este representante
    const { data: representante } = await supabase.from("representantes_autorizados").select("rm").eq("id", id).single()

    if (representante) {
      const { data: inscricoes } = await supabase
        .from("inscricoes_interclasse")
        .select("id")
        .eq("rm_representante", representante.rm)
        .limit(1)

      if (inscricoes && inscricoes.length > 0) {
        return {
          success: false,
          message: "Não é possível remover este representante pois existem inscrições associadas a ele",
        }
      }
    }

    const { error } = await supabase.from("representantes_autorizados").delete().eq("id", id)

    if (error) {
      throw error
    }

    revalidatePath("/admin")
    return { success: true, message: "Representante removido com sucesso" }
  } catch (error) {
    console.error("Erro ao remover representante:", error)
    return { success: false, message: "Erro ao remover representante" }
  }
}
