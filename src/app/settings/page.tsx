"use client";

import Voltar from "@/components/Botoes/voltar";
import { useState, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import { FaSave } from "react-icons/fa";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  // Ajuste para evitar erro caso 'id' não exista em 'user'
  const userId = session?.userId;

  const avatar = session?.user?.avatar || "/default-avatar.jpg";

  const [avatarSelecionado, setAvatarSelecionado] = useState<string>("");
  const [avatarAtual, setAvatarAtual] = useState<string>(avatar);
  const [salvandoAvatar, setSalvandoAvatar] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [userName, setUserName] = useState<string>("");
  const [nomeArtistico, setNomeArtistico] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const [dadosSalvos, setDadosSalvos] = useState({
    userName: "",
    nomeArtistico: "",
    bio: ""
  })

  useEffect(()=> {
    if(session?.user){
      setUserName(session.user.userName || "");
      setNomeArtistico(session.user.artistName || "");
      setBio(session.user.bio || "");
      
      // Também atualizar os dados salvos
      setDadosSalvos({
        userName: session.user.userName || "",
        nomeArtistico: session.user.artistName || "",
        bio: session.user.bio || ""
      });
    }
  }, [session?.user]);

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


  const salvarALteracoes = async () => {
      setDadosSalvos({
        userName: userName,
        nomeArtistico: nomeArtistico,
        bio: bio
      })

      setSalvandoPerfil(true);

      try {
        //array para armazenar promises
        const updatedPromises = [];

        // Verifica se o nome de usuário foi alterado
        if(userName !== dadosSalvos.userName) {
          console.log("atualizando nome de usuário", userName);

          const userNamePromise = fetch("http://localhost:3000/users/profile", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId, // ID do usuário logado
              userName: userName,
            }),
          });

          updatedPromises.push(userNamePromise);
        }

      // Verifica se o nome artístico foi alterado
      if(nomeArtistico !== dadosSalvos.nomeArtistico) {
        console.log("atualizando nome artistico", nomeArtistico);

        const artistNamePromise = fetch("http://localhost:3000/users/update-artist-name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // ID do usuário logado
            artistName: nomeArtistico,
          }),
        });
        updatedPromises.push(artistNamePromise);
      }

      // Verifica se a bio foi alterada
      if(bio !== dadosSalvos.bio) {
        console.log("atualizando bio", bio);
        const bioPromise = fetch("http://localhost:3000/users/update-bio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // ID do usuário logado
            bio: bio,
          }),
        });

        updatedPromises.push(bioPromise);
      }

      // executa todas as promises em paralelo
      if( updatedPromises.length > 0) {
        console.log(`executando ${updatedPromises.length} promises`);

        const responses = await Promise.all(updatedPromises);

        //verifica se todas as respostas foram bem-sucedidas
        const allSuccessful = responses.every(response => response.ok);

        if(allSuccessful) {
          //atualizar estado local
          setDadosSalvos({
            userName: userName,
            nomeArtistico: nomeArtistico,
            bio: bio
          });

          //atualizar sessão do next-auth
          await update({
            ...session,
            user: {
              ...session?.user,
              userName: userName,
              artistName: nomeArtistico,
              bio: bio
            },
          });

          alert("Dados salvos com sucesso!");
          console.log("Dados salvos com sucesso!"); 
        } else {
          //verifica se alguma resposta falhou
          const failedResponses = responses.filter(response => !response.ok);
          console.error("Falha ao salvar dados:", failedResponses);
          alert("Falha ao salvar dados. Tente novamente mais tarde.");
        }
      } else{
        alert("Nenhuma alteração detectada para salvar.");
      }
      } catch {
        console.error("Erro ao atualizar nome de usuário");
        alert("Erro ao atualizar nome de usuário. Tente novamente mais tarde.");
      } finally {
        setSalvandoPerfil(false);
      }

      }

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
      <section className="flex flex-col p-4 gap-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] ">
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

        <article className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
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

          <form
          className="mt-6 flex-col gap-4">
            <div
            className="flex flex-col gap-2 md:flex-row md:gap-4">
              <div>
                <label
                className="text-[var(--soft-cyan)] text-[16px] font-semibold mt-4">
                  Nome Artistico
                </label>

                <input
                  type="text"
                  name="nomeArtistico"
                  value={nomeArtistico}
                  placeholder="Digite seu nome artistico"
                  className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                  onChange={(e) => setNomeArtistico(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="text-[var(--soft-cyan)] text-[16px] font-semibold ">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  name="userName"
                  value={userName}
                  placeholder="Digite seu nome de usuário"
                  className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            <div
            className="mt-4">
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Bio
              </label>
              <textarea
                name="bio"
                value={bio}
                placeholder="Digite sua bio"
                className="w-full h-[100px] p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                maxLength={300}
                onChange={(e) => setBio(e.target.value)}
              />
              <p
              className="text-[var(--cyan-glow)] text-[12px] "> 
                Máximo 300 caracteres 
              </p>
            </div>
          </form>

          <button 
          className="bg-sky-400 max-w-[200px] flex items-center gap-2 hover:bg-sky-300 text-black font-semibold py-2 px-4 rounded-lg focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 cursor-pointer"
          onClick={() => salvarALteracoes()}
          >
            <FaSave/>
            <p> Salvar alterações</p>
          </button>
        </article>

        <article
        className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
          <div
          className="flex flex-col mb-4">
            <h2
            className="text-[var(--bright-azure)] text-[24px] font-semibold">
              Links e Redes Sociais
            </h2>
            <p
            className="text-[var(--soft-cyan)] text-[16px] mb-4">
              Conecte suas redes sociais e portfólios
            </p>
          </div>

          <form
          className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
            <div>
             <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Instagram
              </label>
              <input
              type="text"
              name="instagram"
              placeholder="https://instagram.com/seu_usuario"
              className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2" 
              />
            </div>

            <div>
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Spotify
              </label>
              <input
              type="text"
              name="spotify"
              placeholder="https://open.spotify.com/artist/seu_id"
              className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2" 
              />
            </div>

            <div>
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                YouTube
              </label>
              <input
              type="text"
              name="youtube"
              placeholder="https://youtube.com/c/seu_canal"
              className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2" 
              />
            </div>

            <div>
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                SoundCloud
              </label>
              <input
              type="text"
              name="soundcloud"
              placeholder="https://soundcloud.com/seu_usuario"
              className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2" 
              />
            </div>
          </form>
      </article>

      <article
      className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
        <div
          className="flex flex-col mb-4">
            <h2
            className="text-[var(--bright-azure)] text-[24px] font-semibold">
              Configurações da Conta
            </h2>
            <p
            className="text-[var(--soft-cyan)] text-[16px] mb-4">
              Altere email e senha
            </p>
        </div>

        <form
        className="flex flex-col gap-4 md:gap-6">
          <div>
            <label
            className="text-[var(--soft-cyan)] text-[16px] font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
            />
          </div>

          <div
          className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div
            className="flex-1">
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Senha Atual
              </label>
              <input
                type="password"
                name="senhaAtual"
                placeholder="Digite sua senha atual"
                className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
              />
            </div>
            
            <div
            className="flex-1">
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Nova Senha
              </label>
              <input
                type="password"
                name="senhaNova"
                placeholder="Digite sua nova senha"
                className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
              />
            </div>

            <div
            className="flex-1">
              <label
              className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirme sua nova senha"
                className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
              />
            </div>

          </div>

        </form>
       </article>
      </section>
      {/* Add more settings related components or forms here */}
    </main>
  );
}
