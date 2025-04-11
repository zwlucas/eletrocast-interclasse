"use client";

import { useState, useEffect } from "react";
import { AdminLogin } from "@/components/admin-login";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(adminLoggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <div className="max-w-md mx-auto">
              <AdminLogin onLogin={handleLogin} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
