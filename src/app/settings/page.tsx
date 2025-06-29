"use client";

import Voltar from "@/components/Botoes/voltar";
import { useState, useEffect } from "react";
import { BiCheck } from "react-icons/bi";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  // Ajuste para evitar erro caso 'id' não exista em 'user'
  const userId = session?.userId;

  const avatar = session?.user?.avatar || "/default-avatar.jpg";

  const [avatarSelecionado, setAvatarSelecionado] = useState<string>("");
  const [avatarAtual, setAvatarAtual] = useState<string>(avatar);
  const [salvandoAvatar, setSalvandoAvatar] = useState(false);

  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatarAtual(session.user.avatar);
    }
  }, [session?.user?.avatar]);

  useEffect(() => {
    console.log("Sessão completa:", session);
    console.log("UserId da sessão:", session?.userId);
    console.log("UserId do user:", session?.user?.id);
    console.log("Avatar atual (estado):", avatarAtual);
  }, [session, avatarAtual]);

  const avatars = ["/avatar1.jpg", "/avatar2.jpg"];

  const handleAtualizarAvatar = async () => {
    console.log("Avatar selecionado:", avatarSelecionado); // ← Debug
    console.log("User ID:", userId); // ← Debug

    if (!avatarSelecionado) {
      alert("Selecione um avatar primeiro!");
      return;
    }

    setSalvandoAvatar(true);

    try {
      // Simular requisição para o backend
      const response = await fetch(
        "http://localhost:3000/users/update-avatar",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // ID do usuário logado
            avatarUrl: avatarSelecionado,
          }),
        }
      );

      if (response.ok) {
        setAvatarAtual(avatarSelecionado);
        await update({
          ...session,
          user: {
            ...session?.user,
            avatar: avatarSelecionado,
          },
        });
        alert("Avatar atualizado com sucesso!");
        console.log("Avatar atualizado:", avatarSelecionado);
      }
    } catch {
      alert("Erro ao atualizar avatar:");
    } finally {
      setSalvandoAvatar(false);
    }
  };

  return (
    <main className="bg-[var(--midnight-black)] flex items-center text-white min-h-screen flex-col p-2">
      <section className="flex flex-col p-4 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] ">
        <article className="flex gap-4 items-center">
          <div className="mb-4">
            <Voltar />
          </div>

          <div className="flex flex-col mb-4">
            <h1 className="text-[var(--bright-azure)] text-[24px] font-bold">
              Configurações
            </h1>
            <p className="text-[var(--soft-cyan)] font-medium text-[16px]">
              Gerencie seu perfil e conta
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)]">
          <h2 className="text-[var(--bright-azure)] text-[24px] font-semibold">
            Informações do Perfil
          </h2>

          <p className="text-[var(--soft-cyan)] text-[16px] mb-4">
            Dados que aparecerão no seu perfil público
          </p>

          <div className="flex gap-4 items-center mb-4">
            <div className="w-24 h-24 bg-sky-400/20 rounded-full flex items-center justify-center overflow-hidden">
              {status === "loading" ? (
                <div className="w-24 h-24 bg-sky-400/20 rounded-full animate-pulse"></div>
              ) : (
                <img
                  alt="Avatar Atual"
                  src={avatarAtual || "/default-avatar.jpg"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <p className="text-[var(--soft-cyan)] text-[16px] font-semibold mb-2">
                Avatar Atual
              </p>
              <p className="text-[#31A6DA] text-[14px]">
                Escolha um novo avatar abaixo
              </p>
            </div>
          </div>

          <p className="text-[var(--soft-cyan)] text-[14px] font-semibold mb-2">
            Escolher novo avatar
          </p>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {avatars.map((avatarUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setAvatarSelecionado(avatarUrl)}
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                  avatarSelecionado === avatarUrl
                    ? "border-sky-400 ring-2 ring-sky-400/50"
                    : "border-sky-400/30 hover:border-sky-400/60"
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {avatarSelecionado === avatarUrl && (
                  <div className="absolute inset-0 bg-sky-400/20 flex items-center justify-center">
                    <BiCheck className="w-6 h-6 text-sky-400" />
                  </div>
                )}
              </button>
            ))}

            <div className="mt-4 h-11">
              {" "}
              {/* ← Container com altura fixa */}
              {avatarSelecionado && avatarSelecionado !== avatarAtual ? (
                <button
                  type="button"
                  onClick={handleAtualizarAvatar}
                  disabled={salvandoAvatar}
                  className="bg-sky-400 hover:bg-sky-300 text-black w-35 h-11 sm:w-40 rounded-md cursor-pointer transition-all duration-200"
                >
                  {salvandoAvatar ? "Salvando..." : "Atualizar Avatar"}
                </button>
              ) : avatarSelecionado === avatarAtual ? (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 w-35 h-11 sm:w-40 rounded-md flex items-center justify-center">
                  ✓ Avatar Atual
                </div>
              ) : (
                <div className="w-35 h-11 sm:w-40">
                  {" "}
                  {/* ← Espaço vazio para manter altura */}
                </div>
              )}
            </div>
          </div>
        </article>
        {/* Add more settings related components or forms here */}
      </section>
    </main>
  );
}
