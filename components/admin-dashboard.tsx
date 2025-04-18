"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
// Adicionar o import do ícone Trophy
import { LogOut, Download, Search, Filter, Users, Key, UserCheck, Trophy } from "lucide-react"
import { ManageAdmins } from "@/components/manage-admins"
import { ChangePassword } from "@/components/change-password"
// Adicionar o import do novo componente
import { ManageRepresentatives } from "@/components/manage-representatives"
import Link from "next/link"

interface Jogador {
  nome: string
  capitao: boolean
}

interface Inscricao {
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

interface AdminDashboardProps {
  onLogout: () => void
  adminData: {
    id: number
    username: string
    is_master: boolean
    nome_completo: string
  }
}

export function AdminDashboard({ onLogout, adminData }: AdminDashboardProps) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [filteredInscricoes, setFilteredInscricoes] = useState<Inscricao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalidadeFilter, setModalidadeFilter] = useState("todas")
  const [categoriaFilter, setCategoriaFilter] = useState("todas")
  const [anoFilter, setAnoFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("inscricoes")

  useEffect(() => {
    fetchInscricoes()
  }, [])

  useEffect(() => {
    filterInscricoes()
  }, [inscricoes, searchTerm, modalidadeFilter, categoriaFilter, anoFilter])

  const fetchInscricoes = async () => {
    setIsLoading(true)
    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase
        .from("inscricoes_interclasse")
        .select("*")
        .order("data_envio", { ascending: false })

      if (error) {
        throw error
      }

      setInscricoes(data || [])
      setFilteredInscricoes(data || [])
    } catch (error) {
      console.error("Erro ao buscar inscrições:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as inscrições. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterInscricoes = () => {
    let filtered = [...inscricoes]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (inscricao) =>
          inscricao.nome_representante.toLowerCase().includes(term) ||
          inscricao.rm_representante.toLowerCase().includes(term) ||
          inscricao.curso.toLowerCase().includes(term),
      )
    }

    // Filter by modalidade
    if (modalidadeFilter !== "todas") {
      filtered = filtered.filter((inscricao) => inscricao.modalidade === modalidadeFilter)
    }

    // Filter by categoria
    if (categoriaFilter !== "todas") {
      filtered = filtered.filter((inscricao) => inscricao.categoria === categoriaFilter)
    }

    // Filter by ano
    if (anoFilter !== "todos") {
      filtered = filtered.filter((inscricao) => inscricao.ano === anoFilter)
    }

    setFilteredInscricoes(filtered)
  }

  const getModalidadeLabel = (modalidade: string) => {
    switch (modalidade) {
      case "volei":
        return "Vôlei"
      case "handebol":
        return "Handebol"
      case "futsal":
        return "Futsal"
      default:
        return modalidade
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case "feminino":
        return "Feminino"
      case "masculino":
        return "Masculino"
      default:
        return categoria
    }
  }

  const getModalidadeIcon = (modalidade: string) => {
    switch (modalidade) {
      case "volei":
        return "🏐"
      case "handebol":
        return "🤾"
      case "futsal":
        return "⚽"
      default:
        return ""
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["RM", "Nome", "Ano", "Curso", "Modalidade", "Categoria", "Data de Envio"]
    const csvContent = [
      headers.join(","),
      ...filteredInscricoes.map((inscricao) => {
        return [
          inscricao.rm_representante,
          `"${inscricao.nome_representante}"`,
          `"${inscricao.ano}"`,
          `"${inscricao.curso}"`,
          `"${getModalidadeLabel(inscricao.modalidade)}"`,
          `"${getCategoriaLabel(inscricao.categoria)}"`,
          `"${formatDate(inscricao.data_envio)}"`,
        ].join(",")
      }),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `inscricoes_interclasse_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportTeamToCSV = (inscricao: Inscricao) => {
    // Criar cabeçalho para o CSV
    const headers = ["Posição", "Nome", "Capitão"]

    // Criar linhas para cada jogador
    const jogadoresRows = inscricao.jogadores.map((jogador, index) => {
      return [`${index + 1}`, `"${jogador.nome}"`, jogador.capitao ? "Sim" : "Não"].join(",")
    })

    // Criar informações do time
    const teamInfo = [
      `"Time: ${inscricao.ano} - ${inscricao.curso}"`,
      `"Modalidade: ${getModalidadeLabel(inscricao.modalidade)}"`,
      `"Categoria: ${getCategoriaLabel(inscricao.categoria)}"`,
      `"Representante: ${inscricao.nome_representante} (RM: ${inscricao.rm_representante})"`,
      `"Data de Inscrição: ${formatDate(inscricao.data_envio)}"`,
      "",
    ].join("\n")

    // Montar o conteúdo completo do CSV
    const csvContent = [teamInfo, headers.join(","), ...jogadoresRows].join("\n")

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `time_${inscricao.modalidade}_${inscricao.categoria}_${inscricao.ano}_${inscricao.curso.replace(/\s+/g, "_")}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get unique anos for filter
  const anos = ["todos", ...new Set(inscricoes.map((inscricao) => inscricao.ano))]

  // Count inscriptions by category and modality
  const countInscricoes = (modalidade: string, categoria: string) => {
    return inscricoes.filter(
      (inscricao) =>
        (modalidade === "todas" || inscricao.modalidade === modalidade) &&
        (categoria === "todas" || inscricao.categoria === categoria),
    ).length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Painel de Administração</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bem-vindo, {adminData.nome_completo || adminData.username}
          </p>
        </div>
        {/* Adicionar o botão para a nova aba no menu superior */}
        {/* Adicionar o botão para a página de chaveamento no menu superior */}
        <div className="flex gap-2">
          {adminData.is_master && (
            <>
              <Button
                variant="outline"
                onClick={() => setActiveTab("admins")}
                className={`flex items-center gap-2 ${activeTab === "admins" ? "bg-primary/10" : ""}`}
              >
                <Users className="h-4 w-4" />
                Gerenciar Admins
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("representantes")}
                className={`flex items-center gap-2 ${activeTab === "representantes" ? "bg-primary/10" : ""}`}
              >
                <UserCheck className="h-4 w-4" />
                Representantes
              </Button>
            </>
          )}
          <Link href="/admin/chaveamento" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Chaveamento
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setActiveTab("senha")}
            className={`flex items-center gap-2 ${activeTab === "senha" ? "bg-primary/10" : ""}`}
          >
            <Key className="h-4 w-4" />
            Alterar Senha
          </Button>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Atualizar o TabsList para incluir a nova aba */}
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inscricoes">Inscrições</TabsTrigger>
          {adminData.is_master && <TabsTrigger value="admins">Gerenciar Admins</TabsTrigger>}
          {adminData.is_master && <TabsTrigger value="representantes">Representantes</TabsTrigger>}
          <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
        </TabsList>

        <TabsContent value="inscricoes">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total de Inscrições</CardTitle>
                  <CardDescription>Número total de times inscritos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold dark:text-white">{inscricoes.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Feminino</CardTitle>
                  <CardDescription>Times na categoria feminina</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold dark:text-white">{countInscricoes("todas", "feminino")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Masculino</CardTitle>
                  <CardDescription>Times na categoria masculina</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold dark:text-white">{countInscricoes("todas", "masculino")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Vôlei</CardTitle>
                  <CardDescription>Times inscritos nesta modalidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold dark:text-white">{countInscricoes("volei", "todas")}</p>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Feminino: {countInscricoes("volei", "feminino")}</span>
                    <span>Masculino: {countInscricoes("volei", "masculino")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Handebol</CardTitle>
                  <CardDescription>Times inscritos nesta modalidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold dark:text-white">{countInscricoes("handebol", "todas")}</p>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Feminino: {countInscricoes("handebol", "feminino")}</span>
                    <span>Masculino: {countInscricoes("handebol", "masculino")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Futsal</CardTitle>
                  <CardDescription>Times inscritos nesta modalidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold dark:text-white">{countInscricoes("futsal", "todas")}</p>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Feminino: {countInscricoes("futsal", "feminino")}</span>
                    <span>Masculino: {countInscricoes("futsal", "masculino")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Inscrições</CardTitle>
                <CardDescription>Visualize e gerencie todas as inscrições do Interclasse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, RM ou curso..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-40">
                      <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
                        <SelectTrigger>
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas as Modalidades</SelectItem>
                          <SelectItem value="volei">Vôlei</SelectItem>
                          <SelectItem value="handebol">Handebol</SelectItem>
                          <SelectItem value="futsal">Futsal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                        <SelectTrigger>
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas as Categor</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>

                          <SelectItem value="masculino">Masculino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Select value={anoFilter} onValueChange={setAnoFilter}>
                        <SelectTrigger>
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os Anos</SelectItem>
                          {anos
                            .filter((ano) => ano !== "todos")
                            .map((ano) => (
                              <SelectItem key={ano} value={ano}>
                                {ano}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8 dark:text-gray-300">Carregando inscrições...</div>
                ) : filteredInscricoes.length === 0 ? (
                  <div className="text-center py-8 dark:text-gray-300">Nenhuma inscrição encontrada.</div>
                ) : (
                  <div className="rounded-md border dark:border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>RM</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Ano/Curso</TableHead>
                          <TableHead>Modalidade</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Data de Envio</TableHead>
                          <TableHead>Detalhes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInscricoes.map((inscricao) => (
                          <TableRow key={inscricao.id}>
                            <TableCell className="font-medium">{inscricao.rm_representante}</TableCell>
                            <TableCell>{inscricao.nome_representante}</TableCell>
                            <TableCell>
                              {inscricao.ano} - {inscricao.curso}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  inscricao.modalidade === "volei"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
                                    : inscricao.modalidade === "handebol"
                                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
                                      : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800"
                                }
                              >
                                {getModalidadeLabel(inscricao.modalidade)} {getModalidadeIcon(inscricao.modalidade)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  inscricao.categoria === "feminino"
                                    ? "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800"
                                }
                              >
                                {getCategoriaLabel(inscricao.categoria)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(inscricao.data_envio)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Preparar a lista de jogadores de forma mais legível
                                    const jogadoresList = inscricao.jogadores.map((jogador, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between py-1 border-b border-gray-700 last:border-0"
                                      >
                                        <span>
                                          {index + 1}. {jogador.nome}
                                        </span>
                                        {jogador.capitao && (
                                          <span className="text-yellow-400 font-medium">Capitão</span>
                                        )}
                                      </div>
                                    ))

                                    // Mostrar o toast com os detalhes do time
                                    toast({
                                      title: `Time de ${getModalidadeLabel(inscricao.modalidade)} ${getCategoriaLabel(
                                        inscricao.categoria,
                                      )}`,
                                      description: (
                                        <div className="mt-2 space-y-2">
                                          <div className="text-sm">
                                            <p>
                                              <strong>Turma:</strong> {inscricao.ano} - {inscricao.curso}
                                            </p>
                                            <p>
                                              <strong>Representante:</strong> {inscricao.nome_representante}
                                            </p>
                                            <p>
                                              <strong>RM:</strong> {inscricao.rm_representante}
                                            </p>
                                          </div>
                                          <div className="mt-2">
                                            <p className="font-medium mb-1">Lista de Jogadores:</p>
                                            <div className="max-h-60 overflow-y-auto bg-slate-900 rounded-md p-3 text-sm">
                                              {jogadoresList}
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                      duration: 10000, // Aumentar a duração para dar tempo de ler
                                    })
                                  }}
                                >
                                  Ver Jogadores
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => exportTeamToCSV(inscricao)}
                                >
                                  <Download className="h-3 w-3" />
                                  Exportar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {adminData.is_master && (
          <TabsContent value="admins" className="space-y-4">
            <ManageAdmins />
          </TabsContent>
        )}

        {/* Adicionar o conteúdo da nova aba */}
        {adminData.is_master && (
          <TabsContent value="representantes" className="space-y-4">
            <ManageRepresentatives />
          </TabsContent>
        )}

        <TabsContent value="senha" className="space-y-4">
          <ChangePassword adminId={adminData.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
