"use server"

import { getServerClient } from "@/lib/supabase"
import { processarTimes } from "@/app/actions/chaveamento"

export async function buscarDadosPublicos() {
  try {
    const supabase = getServerClient()

    // Buscar inscrições
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from("inscricoes_interclasse")
      .select("*")
      .order("data_envio", { ascending: false })

    if (inscricoesError) throw inscricoesError

    // Buscar jogos
    const { data: jogos, error: jogosError } = await supabase
      .from("jogos_interclasse")
      .select("*")
      .order("data", { ascending: true })

    if (jogosError) throw jogosError

    // Processar times
    const times = await processarTimes(inscricoes || [])

    return {
      success: true,
      times,
      jogos: jogos || [],
      inscricoes: inscricoes || [],
    }
  } catch (error) {
    console.error("Erro ao buscar dados públicos:", error)
    return {
      success: false,
      times: {},
      jogos: [],
      inscricoes: [],
    }
  }
}
