"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { salvarJogo } from "@/app/actions/chaveamento"

interface ChaveamentoDisplayProps {
  jogos: any[]
  times: any
  onRefresh: () => Promise<void>
}

export function ChaveamentoDisplay({ jogos, times, onRefresh }: ChaveamentoDisplayProps) {
  const [jogoSelecionado, setJogoSelecionado] = useState<any>(null)
  const [placar1, setPlacar1] = useState("")
  const [placar2, setPlacar2] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const getJogosPorFase = (fase: string, grupo?: string) => {
    return jogos.filter((jogo) => jogo.fase === fase && (grupo === undefined || jogo.grupo === grupo))
  }

  const getNomeTime = (timeId: string | null, modalidade: string, categoria: string) => {
    if (!timeId) return "A definir"

    const time = times[modalidade]?.[categoria]?.find((t: any) => t.id === timeId)

    return time?.nome || "A definir"
  }

  const handleEditarJogo = (jogo: any) => {
    setJogoSelecionado(jogo)
    setPlacar1(jogo.placar1?.toString() || "")
    setPlacar2(jogo.placar2?.toString() || "")
    setIsDialogOpen(true)
  }

  const handleSalvarPlacar = async () => {
    if (!jogoSelecionado) return

    setIsSaving(true)
    try {
      const placar1Num = Number.parseInt(placar1) || 0
      const placar2Num = Number.parseInt(placar2) || 0

      // Determinar o vencedor
      let vencedor = null
      if (placar1Num > placar2Num) {
        vencedor = jogoSelecionado.time1
      } else if (placar2Num > placar1Num) {
        vencedor = jogoSelecionado.time2
      }

      const result = await salvarJogo({
        id: jogoSelecionado.id,
        placar1: placar1Num,
        placar2: placar2Num,
        concluido: true,
        vencedor,
      })

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Placar salvo com sucesso",
        })
        setIsDialogOpen(false)
        await onRefresh()
      } else {
        toast({
          title: "Erro",
          description: result.message || "Erro ao salvar placar",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar placar:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o placar",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Verificar se há jogos
  if (jogos.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">Nenhum jogo encontrado. Gere o chaveamento primeiro.</p>
      </div>
    )
  }

  // Verificar se é formato de grupos ou eliminatórias diretas
  const temGrupos = jogos.some((jogo) => jogo.fase === "grupo")

  if (temGrupos) {
    // Formato com fase de grupos
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grupo A */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Grupo A</h3>
            <div className="space-y-3">
              {getJogosPorFase("grupo", "A").map((jogo) => (
                <div
                  key={jogo.id}
                  className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                  onClick={() => handleEditarJogo(jogo)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                  </div>
                  <div className="px-3 text-center">
                    {jogo.concluido ? (
                      <span className="font-bold">
                        {jogo.placar1} x {jogo.placar2}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grupo B */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Grupo B</h3>
            <div className="space-y-3">
              {getJogosPorFase("grupo", "B").map((jogo) => (
                <div
                  key={jogo.id}
                  className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                  onClick={() => handleEditarJogo(jogo)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                  </div>
                  <div className="px-3 text-center">
                    {jogo.concluido ? (
                      <span className="font-bold">
                        {jogo.placar1} x {jogo.placar2}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Semifinais */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Semifinais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getJogosPorFase("semifinal").map((jogo) => (
              <div
                key={jogo.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                onClick={() => handleEditarJogo(jogo)}
              >
                <div className="flex-1">
                  <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {jogo.grupo === "A" ? "1º Grupo A" : "1º Grupo B"}
                  </p>
                </div>
                <div className="px-3 text-center">
                  {jogo.concluido ? (
                    <span className="font-bold">
                      {jogo.placar1} x {jogo.placar2}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {jogo.grupo === "A" ? "2º Grupo B" : "2º Grupo A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Disputa 3º lugar */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Disputa de 3º Lugar</h3>
            {getJogosPorFase("terceiro").map((jogo) => (
              <div
                key={jogo.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                onClick={() => handleEditarJogo(jogo)}
              >
                <div className="flex-1">
                  <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                </div>
                <div className="px-3 text-center">
                  {jogo.concluido ? (
                    <span className="font-bold">
                      {jogo.placar1} x {jogo.placar2}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Final</h3>
            {getJogosPorFase("final").map((jogo) => (
              <div
                key={jogo.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                onClick={() => handleEditarJogo(jogo)}
              >
                <div className="flex-1">
                  <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                </div>
                <div className="px-3 text-center">
                  {jogo.concluido ? (
                    <span className="font-bold">
                      {jogo.placar1} x {jogo.placar2}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    // Formato de eliminatórias diretas
    return (
      <div className="space-y-8">
        {/* Semifinais */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Semifinais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getJogosPorFase("semifinal").map((jogo) => (
              <div
                key={jogo.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                onClick={() => handleEditarJogo(jogo)}
              >
                <div className="flex-1">
                  <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                </div>
                <div className="px-3 text-center">
                  {jogo.concluido ? (
                    <span className="font-bold">
                      {jogo.placar1} x {jogo.placar2}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Disputa 3º lugar */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Disputa de 3º Lugar</h3>
            {getJogosPorFase("terceiro").map((jogo) => (
              <div
                key={jogo.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                onClick={() => handleEditarJogo(jogo)}
              >
                <div className="flex-1">
                  <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                </div>
                <div className="px-3 text-center">
                  {jogo.concluido ? (
                    <span className="font-bold">
                      {jogo.placar1} x {jogo.placar2}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Final</h3>
            {getJogosPorFase("final").map((jogo) => (
              <div
                key={jogo.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                onClick={() => handleEditarJogo(jogo)}
              >
                <div className="flex-1">
                  <p className="font-medium">{getNomeTime(jogo.time1, jogo.modalidade, jogo.categoria)}</p>
                </div>
                <div className="px-3 text-center">
                  {jogo.concluido ? (
                    <span className="font-bold">
                      {jogo.placar1} x {jogo.placar2}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{getNomeTime(jogo.time2, jogo.modalidade, jogo.categoria)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Dialog para editar placar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Placar</DialogTitle>
            <DialogDescription>Informe o resultado da partida</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {jogoSelecionado &&
                  getNomeTime(jogoSelecionado.time1, jogoSelecionado?.modalidade, jogoSelecionado?.categoria)}
              </p>
              <Input
                type="number"
                min="0"
                value={placar1}
                onChange={(e) => setPlacar1(e.target.value)}
                className="text-center"
              />
            </div>

            <div className="flex items-center justify-center">
              <span className="text-xl font-bold">x</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {jogoSelecionado &&
                  getNomeTime(jogoSelecionado.time2, jogoSelecionado?.modalidade, jogoSelecionado?.categoria)}
              </p>
              <Input
                type="number"
                min="0"
                value={placar2}
                onChange={(e) => setPlacar2(e.target.value)}
                className="text-center"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarPlacar} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Placar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
