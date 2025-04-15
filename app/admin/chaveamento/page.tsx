"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { buscarInscricoes, processarTimes, gerarChaveamento, buscarJogos } from "@/app/actions/chaveamento"
import { getAdminSession } from "@/lib/auth"
import { ChaveamentoDisplay } from "@/components/chaveamento-display"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ChaveamentoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("volei")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("feminino")
  const [timesPorModalidade, setTimesPorModalidade] = useState<any>({})
  const [jogos, setJogos] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getAdminSession()
        if (!session) {
          router.push("/admin")
          return
        }
        setIsAdmin(true)
        await carregarDados()
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  const carregarDados = async () => {
    setIsLoading(true)
    try {
      // Buscar inscrições
      const resultInscricoes = await buscarInscricoes()
      if (!resultInscricoes.success) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as inscrições",
          variant: "destructive",
        })
        return
      }

      // Processar times
      const times = await processarTimes(resultInscricoes.inscricoes)
      setTimesPorModalidade(times)

      // Buscar jogos
      const resultJogos = await buscarJogos()
      if (resultJogos.success) {
        setJogos(resultJogos.jogos)
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

  const handleGerarChaveamento = async () => {
    if (!timesPorModalidade[modalidadeSelecionada]?.[categoriaSelecionada]) {
      toast({
        title: "Erro",
        description: "Não há times suficientes para gerar o chaveamento",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const times = timesPorModalidade[modalidadeSelecionada][categoriaSelecionada]
      const result = await gerarChaveamento(times, modalidadeSelecionada, categoriaSelecionada)

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Chaveamento gerado com sucesso",
        })
        await carregarDados()
      } else {
        toast({
          title: "Aviso",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao gerar chaveamento:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o chaveamento",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getJogosFiltrados = () => {
    return jogos.filter((jogo) => jogo.modalidade === modalidadeSelecionada && jogo.categoria === categoriaSelecionada)
  }

  const getTimesFiltrados = () => {
    return timesPorModalidade[modalidadeSelecionada]?.[categoriaSelecionada] || []
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

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/admin" passHref>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o painel
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold dark:text-white">Chaveamento do Interclasse</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie os grupos e jogos do campeonato</p>
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
                        <SelectItem value="volei">Vôlei</SelectItem>
                        <SelectItem value="handebol">Handebol</SelectItem>
                        <SelectItem value="futsal">Futsal</SelectItem>
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
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGerarChaveamento}
                    disabled={isGenerating || getTimesFiltrados().length < 2}
                    className="w-full"
                  >
                    {isGenerating ? "Gerando..." : "Gerar Chaveamento"}
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
                  <CardDescription>Visualize e gerencie os jogos do campeonato</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="chaveamento">
                    <TabsList className="mb-4">
                      <TabsTrigger value="chaveamento">Chaveamento</TabsTrigger>
                      <TabsTrigger value="jogos">Lista de Jogos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chaveamento">
                      <ChaveamentoDisplay
                        jogos={getJogosFiltrados()}
                        times={timesPorModalidade}
                        onRefresh={carregarDados}
                      />
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
                                  Nenhum jogo encontrado. Gere o chaveamento primeiro.
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
