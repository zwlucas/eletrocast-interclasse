"use server"

import { cookies } from "next/headers"
import { getServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import * as crypto from "crypto"

// Função para verificar as credenciais do administrador
export async function verificarCredenciais(username: string, password: string) {
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from("administradores")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (error || !data) {
      console.error("Credenciais inválidas:", error)
      return { success: false, message: "Credenciais inválidas" }
    }

    // Atualizar o último login
    await supabase.from("administradores").update({ ultimo_login: new Date().toISOString() }).eq("id", data.id)

    // Gerar um token de sessão
    const token = crypto.randomBytes(32).toString("hex")
    const adminInfo = {
      id: data.id,
      username: data.username,
      is_master: data.is_master,
      nome_completo: data.nome_completo,
    }

    // Armazenar o token em um cookie seguro
    const cookieStore = cookies()
    cookieStore.set("admin_session", JSON.stringify({ token, admin: adminInfo }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
      sameSite: "lax",
    })

    console.log("Login bem-sucedido para:", username)

    return {
      success: true,
      admin: adminInfo,
    }
  } catch (error) {
    console.error("Erro ao verificar credenciais:", error)
    return { success: false, message: "Erro ao fazer login" }
  }
}

// Função para obter os dados do administrador logado
export async function getAdminSession() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("admin_session")

    if (!sessionCookie) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData.admin
  } catch (error) {
    return null
  }
}

// Função para fazer logout
export async function adminLogout() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
  redirect("/admin")
}

// Função para criar um novo administrador
export async function criarAdministrador(dados: {
  username: string
  password: string
  nome_completo: string
  email: string
}) {
  try {
    const supabase = getServerClient()

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase
      .from("administradores")
      .select("id")
      .eq("username", dados.username)
      .single()

    if (existingUser) {
      return { success: false, message: "Este nome de usuário já existe" }
    }

    const { error } = await supabase.from("administradores").insert([
      {
        username: dados.username,
        password: dados.password,
        nome_completo: dados.nome_completo,
        email: dados.email,
        is_master: false,
      },
    ])

    if (error) {
      throw error
    }

    return { success: true, message: "Administrador criado com sucesso" }
  } catch (error) {
    console.error("Erro ao criar administrador:", error)
    return { success: false, message: "Erro ao criar administrador" }
  }
}

// Função para listar todos os administradores
export async function listarAdministradores() {
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from("administradores")
      .select("id, username, nome_completo, email, is_master, data_criacao, ultimo_login")
      .order("data_criacao", { ascending: false })

    if (error) {
      throw error
    }

    return { success: true, administradores: data }
  } catch (error) {
    console.error("Erro ao listar administradores:", error)
    return { success: false, administradores: [] }
  }
}

// Função para remover um administrador
export async function removerAdministrador(id: number) {
  try {
    const supabase = getServerClient()

    // Verificar se é um usuário master
    const { data: adminData } = await supabase.from("administradores").select("is_master").eq("id", id).single()

    if (adminData?.is_master) {
      return { success: false, message: "Não é possível remover um administrador master" }
    }

    const { error } = await supabase.from("administradores").delete().eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, message: "Administrador removido com sucesso" }
  } catch (error) {
    console.error("Erro ao remover administrador:", error)
    return { success: false, message: "Erro ao remover administrador" }
  }
}

// Função para alterar a senha do administrador
export async function alterarSenha(adminId: number, senhaAtual: string, novaSenha: string) {
  try {
    const supabase = getServerClient()

    // Verificar se a senha atual está correta
    const { data: adminData, error: verifyError } = await supabase
      .from("administradores")
      .select("id")
      .eq("id", adminId)
      .eq("password", senhaAtual)
      .single()

    if (verifyError || !adminData) {
      return { success: false, message: "Senha atual incorreta" }
    }

    // Atualizar a senha
    const { error } = await supabase.from("administradores").update({ password: novaSenha }).eq("id", adminId)

    if (error) {
      throw error
    }

    return { success: true, message: "Senha alterada com sucesso" }
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return { success: false, message: "Erro ao alterar senha" }
  }
}