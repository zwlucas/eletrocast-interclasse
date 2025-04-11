"use server";

import { getServerClient } from "@/lib/supabase";
import type { FormState } from "@/store/form-store";
import { revalidatePath } from "next/cache";

export async function verifyRepresentative(rm: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("representantes_autorizados")
    .select("*")
    .eq("rm", rm)
    .single();

  if (error) {
    return { success: false, message: "RM não encontrado", data: null };
  }

  return {
    success: true,
    message: "RM verificado com sucesso",
    data: {
      rm: data.rm,
      nome: data.nome,
      ano: data.ano,
      curso: data.curso,
    },
  };
}

export async function submitRegistration(formData: FormState) {
  const supabase = getServerClient();

  const { rm, nome, ano, curso, modalidade, categoria, jogadores } = formData;

  const { data, error } = await supabase
    .from("inscricoes_interclasse")
    .upsert(
      {
        rm_representante: rm,
        nome_representante: nome,
        ano,
        curso,
        modalidade,
        categoria,
        jogadores,
        data_envio: new Date().toISOString(),
      },
      {
        onConflict: "rm_representante,modalidade,categoria",
      }
    )
    .select();

  if (error) {
    return {
      success: false,
      message: `Erro ao enviar inscrição: ${error.message}`,
      data: null,
    };
  }

  revalidatePath("/");
  return { success: true, message: "Inscrição enviada com sucesso", data };
}
