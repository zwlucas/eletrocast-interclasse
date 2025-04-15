"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { buscarDadosPublicos } from "@/app/actions/public"
import { PublicChaveamentoDisplay } from "@/components/public-chaveamento-display"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ChaveamentoPublicoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("volei")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("feminino")
  const [timesPorModalidade, setTimesPorModalidade] = useState<any>({})
  const [jogos, setJogos] = useState<any[]>([])
  const [inscricoes, setInscricoes] = useState<any[]>([])

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setIsLoading(true)
    try {
      const result = await buscarDadosPublicos()
      if (result.success) {
        setTimesPorModalidade(result.times)
        setJogos(result.jogos)
        setInscricoes(result.inscricoes)
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do chaveamento",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getJogosFiltrados = () => {
    return jogos.filter((jogo) => jogo.modalidade === modalidadeSelecionada && jogo.categoria === categoriaSelecionada)
  }

  const getTimesFiltrados = () => {
    return timesPorModalidade[modalidadeSelecionada]?.[categoriaSelecionada] || []
  }

  // Contar times por modalidade e categoria
  const contarTimes = (modalidade: string, categoria: string) => {
    return timesPorModalidade[modalidade]?.[categoria]?.length || 0
  }

  // Verificar se há jogos para a modalidade e categoria
  const temJogos = (modalidade: string, categoria: string) => {
    return jogos.some((jogo) => jogo.modalidade === modalidade && jogo.categoria === categoria)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto py-8 px-4 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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

          <div className="mb-8">
            <h1 className="text-3xl font-bold dark:text-white">Chaveamento do Interclasse</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe os jogos e resultados do campeonato interclasse
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                  <CardDescription>Selecione a modalidade e categoria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Modalidade</label>
                    <Select value={modalidadeSelecionada} onValueChange={setModalidadeSelecionada}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volei">
                          Vôlei {temJogos("volei", "feminino") || temJogos("volei", "masculino") ? "🏐" : ""}
                        </SelectItem>
                        <SelectItem value="handebol">
                          Handebol {temJogos("handebol", "feminino") || temJogos("handebol", "masculino") ? "🤾" : ""}
                        </SelectItem>
                        <SelectItem value="futsal">
                          Futsal {temJogos("futsal", "feminino") || temJogos("futsal", "masculino") ? "⚽" : ""}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feminino">
                          Feminino {temJogos(modalidadeSelecionada, "feminino") ? "👩‍🎓" : ""}
                        </SelectItem>
                        <SelectItem value="masculino">
                          Masculino {temJogos(modalidadeSelecionada, "masculino") ? "👨‍🎓" : ""}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={carregarDados} className="w-full">
                    Atualizar Dados
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Times</CardTitle>
                  <CardDescription>{getTimesFiltrados().length} times nesta categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getTimesFiltrados().map((time: any) => (
                      <div key={time.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p className="font-medium">{time.nome}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{time.jogadores.length} jogadores</p>
                      </div>
                    ))}
                    {getTimesFiltrados().length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum time encontrado nesta categoria</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>Números do campeonato</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total de times:</span>
                      <span className="font-bold">{inscricoes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Times de Vôlei:</span>
                      <span className="font-bold">
                        {contarTimes("volei", "feminino") + contarTimes("volei", "masculino")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Times de Handebol:</span>
                      <span className="font-bold">
                        {contarTimes("handebol", "feminino") + contarTimes("handebol", "masculino")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Times de Futsal:</span>
                      <span className="font-bold">
                        {contarTimes("futsal", "feminino") + contarTimes("futsal", "masculino")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Chaveamento de{" "}
                    {modalidadeSelecionada === "volei"
                      ? "Vôlei"
                      : modalidadeSelecionada === "handebol"
                        ? "Handebol"
                        : "Futsal"}{" "}
                    {categoriaSelecionada === "feminino" ? "Feminino" : "Masculino"}
                  </CardTitle>
                  <CardDescription>Visualize os jogos e resultados do campeonato</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="chaveamento">
                    <TabsList className="mb-4">
                      <TabsTrigger value="chaveamento">Chaveamento</TabsTrigger>
                      <TabsTrigger value="jogos">Lista de Jogos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chaveamento">
                      <PublicChaveamentoDisplay jogos={getJogosFiltrados()} times={timesPorModalidade} />
                    </TabsContent>

                    <TabsContent value="jogos">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              <th className="p-2 text-left">Fase</th>
                              <th className="p-2 text-left">Grupo</th>
                              <th className="p-2 text-left">Time 1</th>
                              <th className="p-2 text-left">Time 2</th>
                              <th className="p-2 text-left">Placar</th>
                              <th className="p-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getJogosFiltrados().map((jogo) => {
                              const time1Nome = jogo.time1
                                ? timesPorModalidade[modalidadeSelecionada]?.[categoriaSelecionada]?.find(
                                    (t: any) => t.id === jogo.time1,
                                  )?.nome || "A definir"
                                : "A definir"

                              const time2Nome = jogo.time2
                                ? timesPorModalidade[modalidadeSelecionada]?.[categoriaSelecionada]?.find(
                                    (t: any) => t.id === jogo.time2,
                                  )?.nome || "A definir"
                                : "A definir"

                              return (
                                <tr key={jogo.id} className="border-b dark:border-gray-700">
                                  <td className="p-2">
                                    {jogo.fase === "grupo"
                                      ? "Fase de Grupos"
                                      : jogo.fase === "semifinal"
                                        ? "Semifinal"
                                        : jogo.fase === "final"
                                          ? "Final"
                                          : "Disputa 3º lugar"}
                                  </td>
                                  <td className="p-2">{jogo.grupo || "-"}</td>
                                  <td className="p-2">{time1Nome}</td>
                                  <td className="p-2">{time2Nome}</td>
                                  <td className="p-2">
                                    {jogo.concluido ? `${jogo.placar1 || 0} x ${jogo.placar2 || 0}` : "-"}
                                  </td>
                                  <td className="p-2">
                                    {jogo.concluido ? (
                                      <span className="text-green-600 dark:text-green-400">Concluído</span>
                                    ) : (
                                      <span className="text-yellow-600 dark:text-yellow-400">Pendente</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                            {getJogosFiltrados().length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                  Nenhum jogo encontrado para esta modalidade e categoria.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
