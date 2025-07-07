import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { settingsService, UpdateProfileData } from "@/services/settingsService";


interface SettingsFormData {
  userName: string;
  email: string;
  nomeArtistico: string;
  bio: string;
  instagram: string;
  spotify: string;
  youtube: string;
  // soundcloud: string; // Adicionado campo opcional para SoundCloud
  pix: string;
  senhaAtual: string;
  senhaNova: string;
  confirmarSenha: string;
}

interface AlertMessage {
  title: string;
  message: string;
  type: "success" | "error";
}

export function useSettingsForm() {
  const { data: session, update } = useSession();

  const [paginaCarregada, setPaginaCarregada] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  
  const [formData, setFormData] = useState<SettingsFormData>({
    userName: "",
    email: "",
    nomeArtistico: "",
    bio: "",
    instagram: "",
    spotify: "",
    youtube: "",
    // soundcloud: "", // Inicializando campo opcional
    pix: "",
    senhaAtual: "",
    senhaNova: "",
    confirmarSenha: "",
  });

  const [dadosSalvos, setDadosSalvos] = useState<Partial<SettingsFormData>>({});

  // Carregar dados da sessão
  useEffect(() => {
    if (session?.user) {
      const userData = {
        userName: session.user.userName || "",
        email: session.user.email || "",
        nomeArtistico: session.user.artistName || "",
        bio: session.user.bio || "",
        instagram: session.user.userLink1 || "",
        spotify: session.user.userLink2 || "",
        youtube: session.user.userLink3 || "",
        // soundcloud: session.user.soundCloud || "", // Carregar SoundCloud se disponível
        pix: "",
        senhaAtual: "",
        senhaNova: "",
        confirmarSenha: "",
      };

      setFormData(userData);
      setDadosSalvos(userData);
      setPaginaCarregada(true);
    }
  }, [session]);

  // Validações
  const validateForm = () => {
    // Verificar se há mudanças
    const hasChanges = 
      formData.userName !== dadosSalvos.userName ||
      formData.email !== dadosSalvos.email ||
      formData.nomeArtistico !== dadosSalvos.nomeArtistico ||
      formData.bio !== dadosSalvos.bio ||
      formData.instagram !== dadosSalvos.instagram ||
      formData.spotify !== dadosSalvos.spotify ||
      formData.youtube !== dadosSalvos.youtube ||
      formData.pix.trim() !== "" ||
      formData.senhaNova.trim() !== "";

    if (!hasChanges) {
      throw new Error("Nenhuma alteração detectada para salvar.");
    }

    // Verificar se precisa de senha atual
    const needsPassword = 
      formData.userName !== dadosSalvos.userName ||
      formData.email !== dadosSalvos.email ||
      formData.senhaNova.trim() !== "";

    if (needsPassword && !formData.senhaAtual.trim()) {
      throw new Error("Digite sua senha atual para alterar nome de usuário, email ou senha.");
    }

    // Validar nova senha
    if (formData.senhaNova.trim()) {
      if (formData.senhaNova !== formData.confirmarSenha) {
        throw new Error("Nova senha e confirmação não coincidem.");
      }
      if (formData.senhaNova.length < 6) {
        throw new Error("Nova senha deve ter pelo menos 6 caracteres.");
      }
    }

    // Validar links
    if (formData.instagram.trim() && !isValidInstagram(formData.instagram)) {
      throw new Error("O link do Instagram não é válido.");
    }
    if (formData.spotify.trim() && !isValidSpotify(formData.spotify)) {
      throw new Error("O link do Spotify não é válido.");
    }
    if (formData.youtube.trim() && !isValidYoutube(formData.youtube)) {
      throw new Error("O link do YouTube não é válido.");
    }
  };

  // Validadores
  const isValidInstagram = (link: string) => {
    const regex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    return regex.test(link);
  };

  const isValidSpotify = (link: string) => {
    const regex = /^https:\/\/open\.spotify\.com\/(artist|user)\/[a-zA-Z0-9]+(\?.*)?$/;
    return regex.test(link);
  };

  const isValidYoutube = (link: string) => {
    const regex = /^https:\/\/(www\.)?youtube\.com\/(@[a-zA-Z0-9._\-]+)(\?.*)?$/;
    return regex.test(link);
  };

  // Função principal de salvamento
  const handleSave = async () => {
    setSalvandoPerfil(true);

    try {
      // Validar formulário
      validateForm();

      // Preparar atualizações
      const updates: any = {};

      // Profile (userName, email, senha)
      const hasProfileChanges = 
        formData.userName !== dadosSalvos.userName ||
        formData.email !== dadosSalvos.email ||
        formData.senhaNova.trim() !== "";

      if (hasProfileChanges) {
        updates.profile = {
          password: formData.senhaAtual,
        } as UpdateProfileData;

        if (formData.userName !== dadosSalvos.userName && formData.userName.trim()) {
          updates.profile.userName = formData.userName;
        }
        if (formData.email !== dadosSalvos.email && formData.email.trim()) {
          updates.profile.userMail = formData.email;
        }
        if (formData.senhaNova.trim()) {
          updates.profile.userPassword = formData.senhaNova;
        }
      }

      // Outros campos
      if (formData.nomeArtistico !== dadosSalvos.nomeArtistico) {
        updates.artistName = formData.nomeArtistico;
      }
      if (formData.bio !== dadosSalvos.bio) {
        updates.bio = formData.bio;
      }
      if (formData.instagram !== dadosSalvos.instagram) {
        updates.instagram = formData.instagram;
      }
      if (formData.spotify !== dadosSalvos.spotify) {
        updates.spotify = formData.spotify;
      }
      if (formData.youtube !== dadosSalvos.youtube) {
        updates.youtube = formData.youtube;
      }
        // if (formData.soundcloud !== dadosSalvos.soundcloud) {
        //     updates.soundCloud = formData.soundcloud;
        // }
      if (formData.pix.trim()) {
        updates.pix = formData.pix;
      }

      // Executar atualizações
      const responses = await settingsService.updateMultipleFields(
        updates,
        session?.accessToken || ""
      );

      const allSuccessful = responses.every((response) => response.ok);

      if (!allSuccessful) {
        throw new Error("Houve um erro ao salvar as alterações.");
      }

    


      // Atualizar estado local
      await updateLocalState();

      setAlertMessage({
        title: "Boa!",
        message: "Perfil atualizado com sucesso!",
        type: "success",
      });

    } catch (error) {
      console.error("Erro ao salvar:", error);
      setAlertMessage({
        title: "Erro",
        message: error instanceof Error ? error.message : "Erro inesperado.",
        type: "error",
      });
    } finally {
      setSalvandoPerfil(false);
    }
  };

  // // Atualizar estado local
  // const updateLocalState = async () => {
  //   console.log("Atualizando estado local...");
  //   const newSavedData = {
  //     userName: formData.userName,
  //     email: formData.email,
  //     nomeArtistico: formData.nomeArtistico,
  //     bio: formData.bio,
  //     instagram: formData.instagram,
  //     spotify: formData.spotify,
  //     youtube: formData.youtube,
  //     soundcloud: formData.soundcloud,
  //   };

  //   setDadosSalvos(newSavedData);

  //   // Limpar campos sensíveis
  //   setFormData(prev => ({
  //     ...prev,
  //     senhaAtual: "",
  //     senhaNova: "",
  //     confirmarSenha: "",
  //     pix: "",
  //   }));

  //   // Atualizar sessão
  //   await update({
  //     ...session,
  //     user: {
  //       ...session?.user,
  //       userName: formData.userName,
  //       artistName: formData.nomeArtistico,
  //       bio: formData.bio,
  //       email: formData.email,
  //       userLink1: formData.instagram,
  //       userLink2: formData.spotify,
  //       userLink3: formData.youtube,
  //       userLink4: formData.soundcloud,
  //     },
  //   });
  // };


  // ← CORRIGIR: updateLocalState simplificado
  const updateLocalState = async () => {
    console.log("🔄 Atualizando estado local...");

    // 1. Novos dados salvos (com os valores do formData)
    const newSavedData = {
      userName: formData.userName,
      email: formData.email,
      nomeArtistico: formData.nomeArtistico,
      bio: formData.bio,
      instagram: formData.instagram,
      spotify: formData.spotify,
      youtube: formData.youtube,
    };

    console.log("📋 Novos dados salvos:", newSavedData);

    // 2. Atualizar dados de referência
    setDadosSalvos(newSavedData);

    // 3. Atualizar formData (manter dados na tela + limpar sensíveis)
    setFormData(prev => ({
      ...newSavedData,      // ← MANTÉM OS DADOS DIGITADOS NA TELA
      pix: "",             // ← Limpa PIX (temporário)
      senhaAtual: "",      // ← Limpa senha atual
      senhaNova: "",       // ← Limpa nova senha
      confirmarSenha: "",  // ← Limpa confirmação
    }));

 

  // ✅ Atualiza o estado do formulário (inputs)
  setFormData({
    ...newSavedData, // Mantém os dados digitados na tela
    senhaAtual: "",
    senhaNova: "",
    confirmarSenha: "",
    pix: "",
  });
  }



  // Função para atualizar campos
  const updateField = (field: keyof SettingsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeAlert = () => setAlertMessage(null);

  return {
    formData,
    loading: salvandoPerfil,
    paginaCarregada,
    alertMessage,
    handleSave,
    updateField,
    closeAlert,
    session,
  };
}