import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              Esquenta Paulo Freire 2025
            </h3>
            <p className="text-gray-400 dark:text-gray-300">
              O maior evento esportivo entre turmas da nossa escola, promovendo
              a integração, o espírito esportivo e a competição saudável entre
              as alunas.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/inscricao"
                  className="text-gray-400 dark:text-gray-300 hover:text-white transition"
                >
                  Fazer Inscrição
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-gray-400 dark:text-gray-300 hover:text-white transition"
                >
                  Área do Administrador
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400 dark:text-gray-300">
              <li>Chapa Máxima & Eletrocast</li>
              <li>Email: dsn.lucas@outlook.com</li>
              <li>Telefone: (37) 99826-3682</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 dark:text-gray-300">
          <p>&copy; 2025 Lucas Faria Mendes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
