import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { settingsService } from "@/services/settingsService";

export function useAvatarSettings() {
  const { data: session, update } = useSession();
  const [avatarAtual, setAvatarAtual] = useState("/default-avatar.jpg");
  const [avatarSelecionado, setAvatarSelecionado] = useState("");
  const [salvandoAvatar, setSalvandoAvatar] = useState(false);

  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatarAtual(session.user.avatar);
    }
  }, [session]);

  const handleAtualizarAvatar = async () => {
    if (!avatarSelecionado) {
      throw new Error("Selecione um avatar primeiro!");
    }

    setSalvandoAvatar(true);

    try {
      const response = await settingsService.updateAvatar(
        { avatarUrl: avatarSelecionado },
        session?.accessToken || ""
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar avatar");
      }

      setAvatarAtual(avatarSelecionado);
      
      await update({
        ...session,
        user: {
          ...session?.user,
          avatar: avatarSelecionado,
        },
      });

      return { success: true, message: "Avatar atualizado com sucesso!" };

    } catch (error) {
      throw new Error("Erro ao atualizar avatar. Tente novamente.");
    } finally {
      setSalvandoAvatar(false);
    }
  };

  return {
    avatarAtual,
    avatarSelecionado,
    salvandoAvatar,
    setAvatarSelecionado,
    handleAtualizarAvatar,
  };
}