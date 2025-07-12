
// src/hooks/useSettingsForm.ts
import { useState, useEffect, useCallback } from "react";
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
  pixKey: string;
  pixKeyType: string;
  pixName: string;
  pixCity: string;
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
  const { data: session} = useSession();

  const [paginaCarregada, setPaginaCarregada] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  
  const [formData, setFormData] = useState<SettingsFormData>({
    userName: "",
    email: "",
    nomeArtistico: "",
    bio: "",
    instagram: "",
    spotify: "",
    youtube: "",
    pixKey: "",
    pixKeyType: "",
    pixName: "",
    pixCity: "",
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
        pixKey: "",
        pixKeyType: "",
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

  // ← VALIDAÇÕES ATUALIZADAS PARA PIX
  const validatePixKey = useCallback((key: string, type: string): string | null => {
    if (!key.trim()) return "Chave PIX é obrigatória";

    switch (type) {
      case "cpf":
        // ← Aceita apenas números (sem formatação)
        const cpfNumbers = key.replace(/\D/g, '');
        if (cpfNumbers.length !== 11) return "CPF deve ter 11 dígitos";
        if (!isValidCPF(cpfNumbers)) return "CPF inválido";
        break;

      case "cnpj":
        // ← Aceita apenas números (sem formatação)
        const cnpjNumbers = key.replace(/\D/g, '');
        if (cnpjNumbers.length !== 14) return "CNPJ deve ter 14 dígitos";
        break;

      case "celular":
        // ← ATUALIZADO PARA ACEITAR +5511999887766
        if (!key.startsWith('+55')) return "Celular deve começar com +55";
        
        const phoneNumbers = key.replace(/\D/g, '');
        if (phoneNumbers.length !== 13) return "Celular deve ter 13 dígitos (+55 + DDD + número)";
        
        // Validar DDD válido
        const ddd = phoneNumbers.substring(2, 4);
        const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
        if (!validDDDs.includes(ddd)) return "DDD inválido";
        
        // Validar se é celular (9 dígitos)
        const phoneNumber = phoneNumbers.substring(4);
        if (phoneNumber.length !== 9 || !phoneNumber.startsWith('9')) {
          return "Número deve ser um celular (9 dígitos começando com 9)";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(key)) return "E-mail inválido";
        break;

      case "aleatoria":
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(key.replace(/\s/g, ''))) return "Chave aleatória deve ser um UUID válido";
        break;

      default:
        return "Tipo de chave não selecionado";
    }

    return null;
  }, []);

  // ← VALIDAÇÃO DE CPF ALGORÍTMICA
  const isValidCPF = (cpf: string): boolean => {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 === 10 || digit1 === 11) digit1 = 0;
    if (digit1 !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 === 10 || digit2 === 11) digit2 = 0;
    if (digit2 !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

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
      formData.pixKeyType.trim() !== "" ||
      formData.pixName.trim() !== "" ||
      formData.pixCity.trim() !== "" ||
      formData.senhaNova.trim() !== "";

    if (!hasChanges) {
      throw new Error("Nenhuma alteração detectada para salvar.");
    }

    // ← VALIDAÇÕES PIX
    const hasPixKeyFields = formData.pixKey.trim() || formData.pixKeyType.trim() || formData.pixName.trim() || formData.pixCity.trim();

    if (hasPixKeyFields) {
      if (!formData.pixKeyType.trim()) {
        throw new Error("Tipo de chave PIX é obrigatório quando preenchendo dados de pagamento.");
      }
      if (!formData.pixKey.trim()) {
        throw new Error("Chave PIX é obrigatória quando preenchendo dados de pagamento.");
      }

      // ← VALIDAÇÃO ATUALIZADA DA CHAVE PIX
      const pixKeyError = validatePixKey(formData.pixKey, formData.pixKeyType);
      if (pixKeyError) {
        throw new Error(`Erro na chave PIX: ${pixKeyError}`);
      }

      if (!formData.pixName.trim()) {
        throw new Error("Nome completo é obrigatório quando preenchendo dados de pagamento.");
      }
      if (!formData.pixCity.trim()) {
        throw new Error("Cidade é obrigatória quando preenchendo dados de pagamento.");
      }

      // Validar nome completo
      if (!isValidFullName(formData.pixName)) {
        throw new Error("O nome completo deve conter pelo menos dois nomes.");
      }
      
      console.log("✅ Dados PIX válidos:", {
        pixKeyType: formData.pixKeyType,
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

    if (formData.email.trim() && !isValidEmail(formData.email)) {
      throw new Error("O email informado não é válido.");
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
  const isValidFullName = (name: string) => {
    const fullNameRegex = /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/;
    return fullNameRegex.test(name.trim());
  };

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
      const updates: string | any = {};

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

      // ← PIX COM VALIDAÇÃO ATUALIZADA
      if (formData.pixKey.trim() && formData.pixKeyType.trim() && formData.pixName.trim() && formData.pixCity.trim()) {
        updates.pixKey = formData.pixKey;
        updates.pixKeyType = formData.pixKeyType;
        updates.pixName = formData.pixName;
        updates.pixCity = formData.pixCity;

        console.log("📱 PIX adicionado:", {
          pixKeyType: formData.pixKeyType,
          pixKey: formData.pixKey,
          pixName: formData.pixName,
          pixCity: formData.pixCity
        });
      }

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

  // ← ATUALIZAR ESTADO LOCAL
  const updateLocalState = async () => {
    console.log("🔄 Atualizando estado local...");

    const newSavedData = {
      userName: formData.userName,
      email: formData.email,
      nomeArtistico: formData.nomeArtistico,
      bio: formData.bio,
      instagram: formData.instagram,
      spotify: formData.spotify,
      youtube: formData.youtube,
    };

    setDadosSalvos(newSavedData);

    setFormData(() => ({
      ...newSavedData,
      pixKey: "",
      pixKeyType: "",
      pixName: "",
      pixCity: "",
      senhaAtual: "",
      senhaNova: "",
      confirmarSenha: "",
    }));
  };

  // Função para atualizar campos
  const updateField = (field: keyof SettingsFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: String(value),
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


//00020126360014BR.GOV.BCB.PIX0114+5588992633322520400005303986540520.005802BR5920LUCAS GOSTOSO MENDES6007MOMBACA62190515TXANPW0G8348827630469A8