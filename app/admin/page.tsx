"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getAdminSession, adminLogout } from "@/lib/auth"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminData, setAdminData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getAdminSession()
        if (session) {
          setAdminData(session)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = async () => {
    try {
      // Após o login bem-sucedido, recarregar os dados da sessão
      const session = await getAdminSession()
      console.log("Sessão após login:", session)

      if (session) {
        setAdminData(session)
        setIsLoggedIn(true)
      } else {
        console.error("Sessão não encontrada após login")
      }
    } catch (error) {
      console.error("Erro ao obter sessão após login:", error)
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    setIsLoggedIn(false)
    setAdminData(null)
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
          {!isLoggedIn && (
            <div className="mb-6">
              <Link href="/" passHref>
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para a página inicial
                </Button>
              </Link>
            </div>
          )}

          {isLoggedIn ? (
            <AdminDashboard onLogout={handleLogout} adminData={adminData} />
          ) : (
            <div className="max-w-md mx-auto">
              <AdminLogin onLogin={handleLogin} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
