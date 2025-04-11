import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Esquenta Paulo Freire 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Participe da maior competição esportiva entre turmas da nossa
              escola!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inscricao" passHref>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Fazer Inscrição
                </Button>
              </Link>
              <Link href="/admin" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-blue-600/20 hover:bg-blue-700 dark:border-gray-300 dark:hover:bg-blue-800"
                >
                  Área do Administrador
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Modalidades Disponíveis
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🏐</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Vôlei
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Competição de vôlei entre as turmas. Equipes de 12 jogadores,
                  com 6 em quadra.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 dark:bg-pink-900/30 dark:text-pink-200">
                    Feminino
                  </span>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-200">
                    Masculino
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🤾</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Handebol
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Competição de handebol entre as turmas. Equipes de 12
                  jogadores, com 7 em quadra.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 dark:bg-pink-900/30 dark:text-pink-200">
                    Feminino
                  </span>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-200">
                    Masculino
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">⚽</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Futsal
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Competição de futsal entre as turmas. Equipes de 12 jogadores,
                  com 5 em quadra.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 dark:bg-pink-900/30 dark:text-pink-200">
                    Feminino
                  </span>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-200">
                    Masculino
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Cronograma
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-700"></div>

                {/* Timeline items */}
                <div className="space-y-12">
                  <div className="relative">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold dark:text-white">
                          Inscrições
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Até 12:30 do dia 11/04
                        </p>
                      </div>
                      <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 md:pl-8">
                        <p className="text-gray-600 dark:text-gray-300">
                          Período de inscrições das equipes pelos representantes
                          de turma.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold dark:text-white">
                          Sorteio dos Grupos
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          16/04
                        </p>
                      </div>
                      <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 md:pl-8">
                        <p className="text-gray-600 dark:text-gray-300">
                          Sorteio dos grupos e divulgação da tabela de jogos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold dark:text-white">
                          Competição
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          22/04 a 25/04
                        </p>
                      </div>
                      <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 md:pl-8">
                        <p className="text-gray-600 dark:text-gray-300">
                          Realização dos jogos do Interclasse.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold dark:text-white">
                          Finais e Premiação
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          25/04
                        </p>
                      </div>
                      <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 md:pl-8">
                        <p className="text-gray-600 dark:text-gray-300">
                          Jogos finais e cerimônia de premiação das equipes
                          vencedoras.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Regras Gerais
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Elegibilidade
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Apenas alunos regularmente matriculados na escola podem
                  participar. Cada turma pode inscrever um time por modalidade e
                  categoria. Será levado em consideração frequência e nota.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Inscrições
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  As inscrições devem ser feitas pelos representantes de turma
                  autorizados. Cada equipe deve ter 12 jogadores.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Uniformes
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  As equipes devem usar uniformes nas cores da turma. É
                  obrigatório o uso de tênis apropriado para a prática
                  esportiva.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Conduta
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Espera-se espírito esportivo e respeito entre todos os
                  participantes. Condutas antidesportivas serão penalizadas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
