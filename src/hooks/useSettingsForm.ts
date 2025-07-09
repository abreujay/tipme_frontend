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
  pixKey: string;
  pixName: string; // Campo para nome completo
  pixCity: string; // Campo para cidade
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
    pixKey: "",
    pixName: "", // Inicializando campo para nome completo
    pixCity: "", // Inicializando campo para cidade
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
        pixKey: "",
        pixName: "",
        pixCity: "",
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
      formData.pixKey.trim() !== "" ||
      formData.pixName.trim() !== "" ||
      formData.pixCity.trim() !== "" ||
      formData.senhaNova.trim() !== "";

    if (!hasChanges) {
      throw new Error("Nenhuma alteração detectada para salvar.");
    }

    const haspixKeyFields = formData.pixKey.trim() || formData.pixName.trim() || formData.pixCity.trim()

    if(haspixKeyFields){
      if (!formData.pixKey.trim()) {
        throw new Error("Campo pixKey é obrigatório quando preenchendo dados de pagamento.");
      }
      if (!formData.pixName.trim()) {
        throw new Error("Nome completo é obrigatório quando preenchendo dados de pagamento.");
      }
      if (!formData.pixCity.trim()) {
        throw new Error("Cidade é obrigatória quando preenchendo dados de pagamento.");
      }
      
      console.log("✅ Dados pixKey válidos:", {
        pixKey: formData.pixKey,
        pixName: formData.pixName,
        pixCity: formData.pixCity
      });
    }

    

    // Verificar se precisa de senha atual
    const needsPassword = 
    formData.userName.trim() !== (dadosSalvos.userName || "").trim() ||
    formData.email.trim() !== (dadosSalvos.email || "").trim() ||
    formData.senhaNova.trim() !== "";


    if (needsPassword && !formData.senhaAtual.trim()) {
      throw new Error("Digite sua senha atual para alterar nome de usuário, email ou senha.");
    }

    const isStrongPassword = (password: string) => {
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
      return strongRegex.test(password);
    };

    // Validar nova senha
    if (formData.senhaNova.trim()) {
      if (formData.senhaNova !== formData.confirmarSenha) {
        throw new Error("Nova senha e confirmação não coincidem.");
      }
      if (!isStrongPassword(formData.senhaNova)) {
        throw new Error("Senha muito fraca. Use uma senha mais forte com letras maiúsculas, minúsculas, números e símbolos.");
      }
    }

    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return emailRegex.test(email);
    };

    if(formData.email.trim() && !isValidEmail(formData.email)) {
      throw new Error("O email informado não é válido.");
    }


    //verifica se digirou o nome completo
    const isValidFullName = (name: string) => {
      const fullNameRegex = /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/;
      return fullNameRegex.test(name.trim());
    };

    if(formData.pixName.trim() && !isValidFullName(formData.pixName)) {
      throw new Error("O nome completo deve conter pelo menos dois nomes.");
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
      if (formData.pixKey.trim() && formData.pixName.trim() && formData.pixCity.trim()) {
        updates.pixKey = formData.pixKey;
        updates.pixName = formData.pixName;
        updates.pixCity = formData.pixCity;

        console.log("pixKey adicionado: ", formData.pixKey, formData.pixName, formData.pixCity)
      } // adiciona pixKey apenas se todos os campos estiverem preenchidos


      // Verificar se há algo para enviar
      if (Object.keys(updates).length === 0) {
        throw new Error("Nenhuma alteração detectada para salvar.");
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
      pixKey: "",             // ← Limpa pixKey (temporário)
      pixName: "",            // ← Limpa nome completo
      pixCity: "",            // ← Limpa cidade
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
    pixKey: "",
    pixName: "",
    pixCity: "",
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

