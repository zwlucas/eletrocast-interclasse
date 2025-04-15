"use client"

interface PublicChaveamentoDisplayProps {
  jogos: any[]
  times: any
}

export function PublicChaveamentoDisplay({ jogos, times }: PublicChaveamentoDisplayProps) {
  const getJogosPorFase = (fase: string, grupo?: string) => {
    return jogos.filter((jogo) => jogo.fase === fase && (grupo === undefined || jogo.grupo === grupo))
  }

  const getNomeTime = (timeId: string | null, modalidade: string, categoria: string) => {
    if (!timeId) return "A definir"

    const time = times[modalidade]?.[categoria]?.find((t: any) => t.id === timeId)

    return time?.nome || "A definir"
  }

  // Verificar se há jogos
  if (jogos.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">
          Chaveamento ainda não disponível para esta modalidade e categoria.
        </p>
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
              {getJogosPorFase("grupo", "A").length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">Nenhum jogo definido para este grupo</p>
              )}
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
              {getJogosPorFase("grupo", "B").length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">Nenhum jogo definido para este grupo</p>
              )}
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
}
