"use server"

import { getServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type Jogador = {
  nome: string
  capitao: boolean
}

type Inscricao = {
  id: string
  rm_representante: string
  nome_representante: string
  ano: string
  curso: string
  modalidade: string
  categoria: string
  jogadores: Jogador[]
  data_envio: string
}

type Time = {
  id: string
  nome: string
  representantes: string[]
  jogadores: Jogador[]
  modalidade: string
  categoria: string
}

type Jogo = {
  id: string
  time1: string | null
  time2: string | null
  placar1?: number
  placar2?: number
  fase: string
  grupo?: string
  data?: string
  horario?: string
  local?: string
  concluido: boolean
  vencedor?: string
}

export async function buscarInscricoes() {
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from("inscricoes_interclasse")
      .select("*")
      .order("data_envio", { ascending: false })

    if (error) {
      throw error
    }

    return { success: true, inscricoes: data as Inscricao[] }
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error)
    return { success: false, inscricoes: [] }
  }
}

export async function buscarJogos() {
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase.from("jogos_interclasse").select("*").order("data", { ascending: true })

    if (error) {
      throw error
    }

    return { success: true, jogos: data as Jogo[] }
  } catch (error) {
    console.error("Erro ao buscar jogos:", error)
    return { success: false, jogos: [] }
  }
}

export async function salvarJogo(jogo: Partial<Jogo>) {
  try {
    const supabase = getServerClient()

    if (jogo.id) {
      // Atualizar jogo existente
      const { error } = await supabase.from("jogos_interclasse").update(jogo).eq("id", jogo.id)

      if (error) throw error
    } else {
      // Criar novo jogo
      const { error } = await supabase.from("jogos_interclasse").insert([jogo])

      if (error) throw error
    }

    revalidatePath("/admin/chaveamento")
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar jogo:", error)
    return { success: false, message: "Erro ao salvar jogo" }
  }
}

export async function processarTimes(inscricoes: Inscricao[]) {
  // Agrupar times por modalidade e categoria
  const timesPorModalidade: Record<string, Record<string, Time[]>> = {
    volei: { feminino: [], masculino: [] },
    handebol: { feminino: [], masculino: [] },
    futsal: { feminino: [], masculino: [] },
  }

  // Processamento para Vôlei e Handebol (inter-curso)
  const cursosProcessados: Record<string, Record<string, Record<string, boolean>>> = {
    volei: { feminino: {}, masculino: {} },
    handebol: { feminino: {}, masculino: {} },
  }

  // Processamento para Futsal (interclasse com exceção para DS 3° ano)
  const turmasProcessadasFutsal: Record<string, Record<string, boolean>> = {
    feminino: {},
    masculino: {},
  }

  // Processamento especial para DS 3° ano em Futsal
  const ds3AnoFutsal: Record<string, Time> = {
    feminino: {
      id: "ds-3ano-feminino",
      nome: "DS 3° Ano",
      representantes: [],
      jogadores: [],
      modalidade: "futsal",
      categoria: "feminino",
    },
    masculino: {
      id: "ds-3ano-masculino",
      nome: "DS 3° Ano",
      representantes: [],
      jogadores: [],
      modalidade: "futsal",
      categoria: "masculino",
    },
  }

  // Processar cada inscrição
  inscricoes.forEach((inscricao) => {
    const { modalidade, categoria, ano, curso, nome_representante, jogadores } = inscricao

    // Verificar se a modalidade e categoria são válidas
    if (!timesPorModalidade[modalidade] || !timesPorModalidade[modalidade][categoria]) {
      return
    }

    // Caso especial: Futsal DS 3° Ano (AMS e PI juntos)
    if (modalidade === "futsal" && ano === "3°" && (curso === "DS-AMS" || curso === "DS-PI")) {
      // Adicionar ao time combinado de DS 3° Ano
      ds3AnoFutsal[categoria].representantes.push(nome_representante)

      // Adicionar jogadores sem duplicatas
      jogadores.forEach((jogador) => {
        if (!ds3AnoFutsal[categoria].jogadores.some((j) => j.nome === jogador.nome)) {
          ds3AnoFutsal[categoria].jogadores.push(jogador)
        }
      })

      return
    }

    // Processamento para Vôlei e Handebol (inter-curso)
    if (modalidade === "volei" || modalidade === "handebol") {
      const cursoKey = curso.replace(/\s+/g, "-").toLowerCase()

      // Verificar se já processamos este curso para esta modalidade e categoria
      if (!cursosProcessados[modalidade][categoria][cursoKey]) {
        cursosProcessados[modalidade][categoria][cursoKey] = true

        // Criar um novo time para este curso
        const novoTime: Time = {
          id: `${modalidade}-${cursoKey}-${categoria}`,
          nome: curso,
          representantes: [nome_representante],
          jogadores: [...jogadores],
          modalidade,
          categoria,
        }

        timesPorModalidade[modalidade][categoria].push(novoTime)
      } else {
        // Adicionar ao time existente
        const timeExistente = timesPorModalidade[modalidade][categoria].find((t) => t.nome === curso)

        if (timeExistente) {
          timeExistente.representantes.push(nome_representante)

          // Adicionar jogadores sem duplicatas
          jogadores.forEach((jogador) => {
            if (!timeExistente.jogadores.some((j) => j.nome === jogador.nome)) {
              timeExistente.jogadores.push(jogador)
            }
          })
        }
      }
    }
    // Processamento para Futsal (interclasse normal)
    else if (modalidade === "futsal") {
      const turmaKey = `${ano}-${curso}`.replace(/\s+/g, "-").toLowerCase()

      // Verificar se já processamos esta turma
      if (!turmasProcessadasFutsal[categoria][turmaKey]) {
        turmasProcessadasFutsal[categoria][turmaKey] = true

        // Criar um novo time para esta turma
        const novoTime: Time = {
          id: `futsal-${turmaKey}-${categoria}`,
          nome: `${ano} ${curso}`,
          representantes: [nome_representante],
          jogadores: [...jogadores],
          modalidade: "futsal",
          categoria,
        }

        timesPorModalidade.futsal[categoria].push(novoTime)
      }
    }
  })

  // Adicionar os times especiais de DS 3° Ano para Futsal
  if (ds3AnoFutsal.feminino.representantes.length > 0) {
    timesPorModalidade.futsal.feminino.push(ds3AnoFutsal.feminino)
  }

  if (ds3AnoFutsal.masculino.representantes.length > 0) {
    timesPorModalidade.futsal.masculino.push(ds3AnoFutsal.masculino)
  }

  return timesPorModalidade
}

export async function gerarChaveamento(times: Time[], modalidade: string, categoria: string) {
  try {
    const supabase = getServerClient()

    // Verificar se já existem jogos para esta modalidade e categoria
    const { data: jogosExistentes, error: errorJogos } = await supabase
      .from("jogos_interclasse")
      .select("id")
      .eq("modalidade", modalidade)
      .eq("categoria", categoria)

    if (errorJogos) throw errorJogos

    // Se já existem jogos, não gerar novamente
    if (jogosExistentes && jogosExistentes.length > 0) {
      return {
        success: false,
        message: "Já existem jogos gerados para esta modalidade e categoria",
      }
    }

    // Embaralhar os times para sorteio aleatório
    const timesEmbaralhados = [...times].sort(() => Math.random() - 0.5)

    // Determinar o formato do chaveamento com base no número de times
    const numTimes = timesEmbaralhados.length
    const jogos: Partial<Jogo>[] = []

    if (numTimes <= 1) {
      return {
        success: false,
        message: "Número insuficiente de times para gerar chaveamento",
      }
    } else if (numTimes <= 4) {
      // Formato simples: semifinal e final
      // Semifinais
      jogos.push({
        time1: numTimes >= 1 ? timesEmbaralhados[0].id : null,
        time2: numTimes >= 2 ? timesEmbaralhados[1].id : null,
        fase: "semifinal",
        grupo: "A",
        concluido: false,
        modalidade,
        categoria,
      })

      jogos.push({
        time1: numTimes >= 3 ? timesEmbaralhados[2].id : null,
        time2: numTimes >= 4 ? timesEmbaralhados[3].id : null,
        fase: "semifinal",
        grupo: "B",
        concluido: false,
        modalidade,
        categoria,
      })

      // Final
      jogos.push({
        time1: null,
        time2: null,
        fase: "final",
        concluido: false,
        modalidade,
        categoria,
      })

      // Disputa de 3º lugar
      jogos.push({
        time1: null,
        time2: null,
        fase: "terceiro",
        concluido: false,
        modalidade,
        categoria,
      })
    } else {
      // Formato com grupos e eliminatórias
      // Dividir em dois grupos
      const grupoA = timesEmbaralhados.slice(0, Math.ceil(numTimes / 2))
      const grupoB = timesEmbaralhados.slice(Math.ceil(numTimes / 2))

      // Jogos do Grupo A
      for (let i = 0; i < grupoA.length; i++) {
        for (let j = i + 1; j < grupoA.length; j++) {
          jogos.push({
            time1: grupoA[i].id,
            time2: grupoA[j].id,
            fase: "grupo",
            grupo: "A",
            concluido: false,
            modalidade,
            categoria,
          })
        }
      }

      // Jogos do Grupo B
      for (let i = 0; i < grupoB.length; i++) {
        for (let j = i + 1; j < grupoB.length; j++) {
          jogos.push({
            time1: grupoB[i].id,
            time2: grupoB[j].id,
            fase: "grupo",
            grupo: "B",
            concluido: false,
            modalidade,
            categoria,
          })
        }
      }

      jogos.push({
        time1: null,
        time2: null,
        fase: "semifinal",
        grupo: "A",
        concluido: false,
        modalidade,
        categoria,
      })

      jogos.push({
        time1: null,
        time2: null,
        fase: "semifinal",
        grupo: "B",
        concluido: false,
        modalidade,
        categoria,
      })

      // Final
      jogos.push({
        time1: null,
        time2: null,
        fase: "final",
        concluido: false,
        modalidade,
        categoria,
      })

      jogos.push({
        time1: null,
        time2: null,
        fase: "terceiro",
        concluido: false,
        modalidade,
        categoria,
      })
    }

    const { error } = await supabase.from("jogos_interclasse").insert(jogos)

    if (error) throw error

    revalidatePath("/admin/chaveamento")
    return { success: true }
  } catch (error) {
    console.error("Erro ao gerar chaveamento:", error)
    return { success: false, message: "Erro ao gerar chaveamento" }
  }
}