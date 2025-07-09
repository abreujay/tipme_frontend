// "use client";

// import Voltar from "@/components/Botoes/voltar";
// import { useState, useEffect } from "react";
// import { BiCheck } from "react-icons/bi";
// import { FaSave } from "react-icons/fa";
// // import { RiDeleteBin6Line } from "react-icons/ri";
// import { FaRegEyeSlash } from "react-icons/fa";
// import { MdOutlineRemoveRedEye } from "react-icons/md";

// import { useSession } from "next-auth/react";
// import { LoadingSpinner } from "@/components/Loading/spinner";
// // import { title } from "process";
// import { SettingsAlert } from "@/components/Alert/SettingsAlert";
// import { DeleteAccountDialog } from "@/components/Dialog/deleteAccountDialog";


// export default function SettingsPage() {
//   const { data: session, update, status } = useSession();
//   // Ajuste para evitar erro caso 'id' não exista em 'user'
//   // const userId = session?.userId;


//   const avatar = session?.user?.avatar || "/default-avatar.jpg";


//   const [avatarSelecionado, setAvatarSelecionado] = useState<string>("");
//   const [avatarAtual, setAvatarAtual] = useState<string>();
//   const [salvandoAvatar, setSalvandoAvatar] = useState(false);
//   const [salvandoPerfil, setSalvandoPerfil] = useState(false);

//   const [passwordAtualVisible, setPasswordAtualVisible] = useState(false);
//   const [newPasswordVisible, setNewPasswordVisible] = useState(false);
//   const [passwordConfirmeVisible, setPasswordConfirmeVisible] = useState(false);  

//   const [userName, setUserName] = useState<string>("");
//   const [nomeArtistico, setNomeArtistico] = useState<string>("");
//   const [bio, setBio] = useState<string>("");

//   // ← Estados para dados da conta
//   const [email, setEmail] = useState<string>("");
//   const [senhaAtual, setSenhaAtual] = useState<string>("");
//   const [senhaNova, setSenhaNova] = useState<string>("");
//   const [confirmarSenha, setConfirmarSenha] = useState<string>("");

//   const [instagram, setInstagram] = useState<string>("");
//   const [spotify, setSpotify] = useState<string>("");
//   const [youtube, setYoutube] = useState<string>("");

//   const [pix, setPix] = useState<string>("");
//   // const [paypal, setPaypal] = useState<string>("");

//   const [carregouDados, setCarregouDados] = useState(false);

//   // usando state para alert
//  const [alertMessage, setAlertMessage] = useState<{ title: string; message: string; type: "success" | "error" } | null>(null);


//   const [dadosSalvos, setDadosSalvos] = useState({
//     userName: "",
//     nomeArtistico: "",
//     avatar: "",
//     bio: "",
//     email: "",
//     instagram: "",
//     spotify: "",
//     youtube: "",
//   });

//   useEffect(() => {
//     console.log("=== DEBUG SESSÃO ===");
//     console.log("Session completa:", session);
//     console.log("userName:", session?.user?.userName);
//     console.log("artistName:", session?.user?.artistName);
//     console.log("bio:", session?.user?.bio);
//     console.log("avatar:", session?.user?.avatar);
//     console.log("email:", session?.user?.email);
//     console.log("==================");
//   }, [session]);

//   useEffect(() => {
//     if (session?.user) {
//       console.log("preenchendo campos com dados da sessão");

//       setUserName(session.user.userName || "");
//       setNomeArtistico(session.user.artistName || "");
//       setAvatarAtual(session.user.avatar || "/default-avatar.jpg");
//       setBio(session.user.bio || "");
//       setEmail(session.user.email || "");
//       setInstagram(session.user.userLink1 || "");
//       setSpotify(session.user.userLink2 || "");
//       setYoutube(session.user.userLink3 || "");

//       // setAvatarAtual(session.user.avatar || "/default-avatar.jpg");

//       setDadosSalvos({
//         userName: session.user.userName || "",
//         nomeArtistico: session.user.artistName || "",
//         avatar: session.user.avatar || "/default-avatar.jpg",
//         bio: session.user.bio || "",
//         email: session.user.email || "",
//         instagram: session.user.userLink1 || "",
//         spotify: session.user.userLink2 || "",
//         youtube: session.user.userLink3 || "",
//       });

//       setCarregouDados(true);

//       console.log("campos preenchidos com sucesso");
//     }
//   }, [JSON.stringify(session?.user)]);


//   const avatars = ["/avatar1.jpg", "/avatar2.jpg"];


//   function isValidInstagram(url: string) {
//     return /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/.test(url);
//   }

//   function isValidSpotify(url: string) {
//     return /^https?:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9]+\/?$/.test(url);
//   }

//  function isValidYoutube(link: string): boolean {
//     const regex = /^https:\/\/(www\.)?youtube\.com\/(@[a-zA-Z0-9._\-]+)(\?.*)?$/;
//     return regex.test(link);
// }



//   const salvarALteracoes = async () => {
//     setSalvandoPerfil(true);

//      // ← 2. VERIFICAR se precisa de senha atual (apenas para userName, email e senha)
//   const precisaSenhaAtual = 
//     userName !== dadosSalvos.userName ||
//     email !== dadosSalvos.email ||
//     senhaNova.trim() !== "";

//   if (precisaSenhaAtual && !senhaAtual.trim()) {
//     setAlertMessage({
//       title: "Erro",
//       message: "Digite sua senha atual para alterar nome de usuário, email ou senha.",
//       type: "error",
//     });
//     setSalvandoPerfil(false);
//     return;
//   }

//   // ← 3. VALIDAÇÃO: Nova senha (se preenchida)
//   if (senhaNova.trim()) {
//     if (senhaNova !== confirmarSenha) {
//       setAlertMessage({
//         title: "Erro",
//         message: "Nova senha e confirmação não coincidem.",
//         type: "error",
//       });
//       setSalvandoPerfil(false);
//       return;
//     }

//     if (senhaNova.length < 6) {
//       setAlertMessage({
//         title: "Erro",
//         message: "Nova senha deve ter pelo menos 6 caracteres.",
//         type: "error",
//       });
//       setSalvandoPerfil(false);
//       return;
//     }
//   }
   
//     const instagramSanitized = instagram.trim();
//     const spotifySanitized = spotify.trim();
//     const youtubeSanitized = youtube.trim();

//     if (instagramSanitized && !isValidInstagram(instagramSanitized)) {
//       setAlertMessage({
//         title: "Erro",
//         message: "O link do Instagram não é válido. Exemplo: https://instagram.com/seu_usuario",
//         type: "error",
//       });
//       setSalvandoPerfil(false);
//       return;
//     }

//     if (spotifySanitized && !isValidSpotify(spotifySanitized)) {
//       setAlertMessage({
//         title: "Erro",
//         message: "O link do Spotify não é válido. Exemplo: https://open.spotify.com/artist/seu_id",
//         type: "error",
//       });
//       setSalvandoPerfil(false);
//       return;
//     }

//     if (youtubeSanitized && !isValidYoutube(youtubeSanitized)) {
//       setAlertMessage({
//         title: "Erro",
//         message: "O link do YouTube não é válido. Exemplo: https://youtube.com/c/seu_canal",
//         type: "error",
//       });
//       setSalvandoPerfil(false);
//       return;
//     }

//     try {
//       //array para armazenar promises
//       const updatedPromises = [];

//       // ← 1. VERIFICAR SE PRECISA ATUALIZAR PROFILE (userName, email, senha)
//       const profileData: { [key: string]: any } = {};
//       let needsProfileUpdate = false;

//       if (userName !== dadosSalvos.userName && userName.trim()) {
//         profileData.userName = userName;
//         needsProfileUpdate = true;
//       }

//       if (email !== session?.user?.email && email.trim()) {
//         profileData.userMail = email;        needsProfileUpdate = true;
//       }

//      if(senhaNova.trim()){
//       profileData.newPassword = senhaNova
//       needsProfileUpdate = true;
//      }

//       // ← Fazer fetch para /users/profile se necessário
//       if (needsProfileUpdate) {
//         profileData.password = senhaAtual
//         const profilePromise = fetch("http://localhost:3000/users/profile", {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(profileData),
//         });
//         updatedPromises.push(profilePromise);
//       }

//       // Verifica se o nome artístico foi alterado
//       if (nomeArtistico !== dadosSalvos.nomeArtistico) {

//         console.log("atualizando nome artistico", nomeArtistico);

//         const artistNamePromise = fetch(
//           "http://localhost:3000/users/artist-name",
//           {
//             method: "PATCH",
//             headers: {
//               Authorization: `Bearer ${session?.accessToken}`, // Usando o token de acesso da sessão
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               artistName: nomeArtistico,
//             }),
//           }
//         );

//         updatedPromises.push(artistNamePromise);
//       }

//       // Verifica se a bio foi alterada
//       if (bio !== dadosSalvos.bio) {
//         console.log("atualizando bio", bio);
//         const bioPromise = fetch("http://localhost:3000/users/bio", {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`, // Usando o token de acesso da sessão
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             bio: bio,
//           }),
//         });

//         updatedPromises.push(bioPromise);
//       }

//       //verifica se o instagram foi alterado
//       if (instagramSanitized !== dadosSalvos.instagram) {
//         console.log("atualizando instagram", instagramSanitized);
//         const instagramPromise = fetch("http://localhost:3000/users/link1", {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`, // Usando o token de acesso da sessão
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userLink1: {
//               link: instagramSanitized,
//             },
//           }),
//         });

//         updatedPromises.push(instagramPromise);
//       }

//       //verifica se o spotify foi alterado
//       if (spotifySanitized !== dadosSalvos.spotify) {
//         console.log("atualizando spotify", spotifySanitized);
//         const spotifyPromise = fetch("http://localhost:3000/users/link2", {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`, // Usando o token de acesso da sessão
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userLink2: {
//               link: spotifySanitized,
//             },
//           }),
//         });

//         updatedPromises.push(spotifyPromise);
//       }

//       //verifica se o youtube foi alterado
//       if (youtubeSanitized !== dadosSalvos.youtube) {
//         console.log("atualizando youtube", youtube);
//         const youtubePromise = fetch("http://localhost:3000/users/link3", {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`, // Usando o token de acesso da sessão
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userLink3: {
//               link: youtubeSanitized,
//             },
//           }),
//         });

//         updatedPromises.push(youtubePromise);
//       }

//       if(pix !== "") {
//         const PixPromise = fetch("http://localhost:3000/pix/save-pix", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`, // Usando o token de acesso da sessão
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             pixKey: pix,
//           }),
//         });
//         updatedPromises.push(PixPromise);
//       }
      

//       // executa todas as promises em paralelo
//       if (updatedPromises.length > 0) {
//         console.log(`executando ${updatedPromises.length} promises`);

//         const responses = await Promise.all(updatedPromises);

//         //verifica se todas as respostas foram bem-sucedidas
//         const allSuccessful = responses.every((response) => response.ok);

//         if (allSuccessful) {
//           //atualizar estado local
//           setDadosSalvos({
//             userName: userName,
//             nomeArtistico: nomeArtistico,
//             bio: bio,
//             email: email,
//             instagram: instagramSanitized,
//             spotify: spotifySanitized,
//             youtube: youtubeSanitized,
//             avatar: avatarAtual || "/default-avatar.jpg",
//           });

//           //atualizar sessão do next-auth
//           update({
//             ...session,
//             user: {
//               ...session?.user,
//               userName: userName,
//               artistName: nomeArtistico,
//               bio: bio,
//               email: email,
//               userLink1: instagramSanitized,
//               userLink2: spotifySanitized,
//               userLink3: youtubeSanitized,
//               avatar: avatarAtual,
//             },
//           });


//           if(precisaSenhaAtual){
//             setSenhaAtual("");
//             setSenhaNova("")
//             setConfirmarSenha("")
//           }

//           setPix("")

//           setAlertMessage({
//             title: "Boa!",
//             message: "Perfil atualizado com sucesso!",
//             type: "success",
//           })
//         } else {
//           //verifica se alguma resposta falhou
//           const failedResponses = responses.filter((response) => !response.ok);
//           console.error("Falha ao salvar dados:", failedResponses);
//           setAlertMessage({
//             title: "Erro",
//             message: "Houve um erro ao salvar as alterações. Tente novamente mais tarde.",
//             type: "error",
//           })
//         }
//       } else {
//         setAlertMessage({
//           title: "Atenção",
//           message: "Nenhuma alteração detectada para salvar.",
//           type: "error",
//         });
//       }

//     } catch {
//       setAlertMessage({
//         title: "Erro",
//         message: "Erro ao atualizar nome de usuário. Tente novamente mais tarde.",
//         type: "error",
//       });
//     } finally {
//       setSalvandoPerfil(false);
//     }
//   };

//   const handleAtualizarAvatar = async () => {
//     console.log("Avatar selecionado:", avatarSelecionado); // ← Debug
 

//     if (!avatarSelecionado) {
//       alert("Selecione um avatar primeiro!");
//       return;
//     }

//     setSalvandoAvatar(true);

//     try {
//       // Simular requisição para o backend
//       const response = await fetch(
//         "http://localhost:3000/users/update-avatar",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${session?.accessToken}`,
//           },
//           body: JSON.stringify({
//             avatarUrl: avatarSelecionado,
//           }),
//         }
//       );

//       if (response.ok) {
//         setAvatarAtual(avatarSelecionado);
//         await update({
//           ...session,
//           user: {
//             ...session?.user,
//             avatar: avatarSelecionado,
//           },
//         });
//        setAlertMessage({
//           title: "Sucesso!",
//           message: "Avatar atualizado com sucesso!",
//           type: "success",
//         });
//       }
//     } catch {
//       setAlertMessage({
//         title: "Erro",
//         message: "Erro ao atualizar avatar. Tente novamente mais tarde.",
//         type: "error",
//       });
//     } finally {
//       setSalvandoAvatar(false);
//     }
//   };

//   const [telaCarregando, setTelaCarregando] = useState(true);

//   useEffect(() => {
//     if (session && session.user) {
//       setTelaCarregando(false);
//     }
//   }, [session]);

//   const closeAlert = () => {
//     setAlertMessage(null);
//   };

//   if (telaCarregando) {
//   return (
//     <div className="flex items-center justify-center h-screen bg-black">
//       <LoadingSpinner size="lg" text="Carregando..." />
//     </div>
//   );
//   }


//   // //se não houver sessão, retorna null ou redireciona
//   // if (!session) {

//   //     return null;
//   // }

//   return (
//     <main className="bg-[var(--midnight-black)] flex items-center text-black min-h-screen flex-col p-2">

//       {
//         alertMessage && (
//           <SettingsAlert
//             type={alertMessage.type}
//             title={alertMessage.title}
//             message={alertMessage.message}
//             onClose={closeAlert}
//           />
//         )
//       }

//       <section className="flex flex-col p-4 gap-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] ">
//         <article className="flex gap-4 items-center">
//           <div className="mb-4">
//             <Voltar />
//           </div>

//           <div className="flex flex-col mb-4">
//             <h1 className="text-[var(--bright-azure)] text-[24px] font-bold">
//               Configurações
//             </h1>
//             <p className="text-[var(--soft-cyan)] font-medium text-[16px]">
//               Gerencie seu perfil e conta
//             </p>
//           </div>
//         </article>

//         <article className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
//           <h2 className="text-[var(--bright-azure)] text-[24px] font-semibold">
//             Informações do Perfil
//           </h2>

//           <p className="text-[var(--soft-cyan)] text-[16px] mb-4">
//             Dados que aparecerão no seu perfil público
//           </p>

//           <div className="flex gap-4 items-center mb-4">
//             <div className="w-24 h-24 bg-sky-400/20 rounded-full flex items-center justify-center overflow-hidden">
//               <img
//                 alt="Avatar Atual"
//                 src={avatarAtual || "/default-avatar.jpg"}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div>
//               <p className="text-[var(--soft-cyan)] text-[16px] font-semibold mb-2">
//                 Avatar Atual
//               </p>
//               <p className="text-[#31A6DA] text-[14px]">
//                 Escolha um novo avatar abaixo
//               </p>
//             </div>
//           </div>

//           <p className="text-[var(--soft-cyan)] text-[14px] font-semibold mb-2">
//             Escolher novo avatar
//           </p>

//           <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
//             {avatars.map((avatarUrl, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => setAvatarSelecionado(avatarUrl)}
//                 className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 ${
//                   avatarSelecionado === avatarUrl
//                     ? "border-sky-400 ring-2 ring-sky-400/50"
//                     : "border-sky-400/30 hover:border-sky-400/60"
//                 }`}
//               >
//                 <img
//                   src={avatarUrl}
//                   alt={`Avatar ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//                 {avatarSelecionado === avatarUrl && (
//                   <div className="absolute inset-0 bg-sky-400/20 flex items-center justify-center">
//                     <BiCheck className="w-6 h-6 text-sky-400" />
//                   </div>
//                 )}
//               </button>
//             ))}

//             <div className="mt-4 h-11">
//               {" "}
//               {/* ← Container com altura fixa */}
//               {avatarSelecionado && avatarSelecionado !== avatarAtual ? (
//                 <button
//                   type="button"
//                   onClick={handleAtualizarAvatar}
//                   disabled={salvandoAvatar}
//                   className="bg-sky-400 hover:bg-sky-300 text-black w-35 h-11 sm:w-40 rounded-md cursor-pointer transition-all duration-200"
//                 >
//                   {salvandoAvatar ? "Salvando..." : "Atualizar Avatar"}
//                 </button>
//               ) : avatarSelecionado === avatarAtual ? (
//                 <div className="bg-green-500/20 border border-green-500/30 text-green-400 w-35 h-11 sm:w-40 rounded-md flex items-center justify-center">
//                   ✓ Avatar Atual
//                 </div>
//               ) : (
//                 <div className="w-35 h-11 sm:w-40">
//                   {" "}
//                   {/* ← Espaço vazio para manter altura */}
//                 </div>
//               )}
//             </div>
//           </div>

//           <form className="mt-6 flex-col gap-4">
//             <div className="flex flex-col gap-2 md:flex-row md:gap-4">
//               <div className="flex-1">
//                 <label className="text-[var(--soft-cyan)] text-[16px] font-semibold mt-4">
//                   Nome Artistico
//                 </label>

//                 <input
//                   type="text"
//                   name="nomeArtistico"
//                   value={nomeArtistico}
//                   placeholder="Digite seu nome artistico"
//                   className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                   onChange={(e) => setNomeArtistico(e.target.value)}
//                 />
//               </div>

//               <div className="flex-1">
//                 <label className="text-[var(--soft-cyan)] text-[16px] font-semibold ">
//                   Nome de Usuário
//                 </label>
//                 <input
//                   type="text"
//                   name="userName"
//                   value={userName}
//                   placeholder="Digite seu nome de usuário"
//                   className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                   onChange={(e) => setUserName(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 Bio
//               </label>
//               <textarea
//                 name="bio"
//                 value={bio}
//                 placeholder="Digite sua bio"
//                 className="w-full h-[100px] p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                 maxLength={300}
//                 onChange={(e) => setBio(e.target.value)}
//               />
//               <p className="text-[var(--cyan-glow)] text-[12px] ">
//                 Máximo 300 caracteres
//               </p>
//             </div>
//           </form>
//         </article>

//         <article className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
//           <div className="flex flex-col mb-4">
//             <h2 className="text-[var(--bright-azure)] text-[24px] font-semibold">
//               Links e Redes Sociais
//             </h2>
//             <p className="text-[var(--soft-cyan)] text-[16px] mb-4">
//               Conecte suas redes sociais e portfólios
//             </p>
//           </div>

//           <form className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 Instagram
//               </label>
//               <input
//                 type="text"
//                 name="instagram"
//                 value={instagram}
//                 placeholder="https://instagram.com/seu_usuario"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                 onChange={(e) => setInstagram(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 Spotify
//               </label>
//               <input
//                 type="text"
//                 name="spotify"
//                 value={spotify}
//                 placeholder="https://open.spotify.com/artist/seu_id"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                 onChange={(e) => setSpotify(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 YouTube
//               </label>
//               <input
//                 type="text"
//                 name="youtube"
//                 value={youtube}
//                 placeholder="https://youtube.com/@seuUsuario"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                 onChange={(e) => setYoutube(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 SoundCloud
//               </label>
//               <input
//                 type="text"
//                 name="soundcloud"
//                 placeholder="https://soundcloud.com/seu_usuario"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//               />
//             </div>
//           </form>
//         </article>

//         <article className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
//           <div className="flex flex-col mb-4">
//             <h2 className="text-[var(--bright-azure)] text-[24px] font-semibold">
//               Configurações da Conta
//             </h2>
//             <p className="text-[var(--soft-cyan)] text-[16px] mb-4">
//               Altere email e senha
//             </p>
//           </div>

//           <form className="flex flex-col gap-4 md:gap-6">
//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={email}
//                 placeholder="Digite seu email"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col gap-4 md:flex-row md:gap-6">
//               <div className="flex-1">
//                 <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">Senha Atual</label>
//                 <div className="relative">
//                   <input
//                     name="senhaAtual"
//                     type={passwordAtualVisible ? "text" : "password"}
//                     value={senhaAtual}
//                     className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                     placeholder="Digite sua senha"
//                     required
//                     onChange={(e) => setSenhaAtual(e.target.value)}
//                   />
//                   <span
//                     onClick={() => setPasswordAtualVisible(!passwordAtualVisible)}
//                     className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                   >
//                     {passwordAtualVisible ? (
//                       <FaRegEyeSlash className="text-sky-400" />
//                     ) : (
//                       <MdOutlineRemoveRedEye className="text-sky-400" />
//                     )}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex-1">
//                 <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                   Nova Senha
//                 </label>
//                 <div className="relative">
//                   <input
//                     name="senhaNova"
//                     type={newPasswordVisible ? "text" : "password"}
//                     value={senhaNova}
//                     className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                     placeholder="Digite sua senha"
//                     required
//                     onChange={(e) => setSenhaNova(e.target.value)}
//                   />
//                   <span
//                     onClick={() => setNewPasswordVisible(!newPasswordVisible)}
//                     className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                   >
//                     {newPasswordVisible ? (
//                       <FaRegEyeSlash className="text-sky-400" />
//                     ) : (
//                       <MdOutlineRemoveRedEye className="text-sky-400" />
//                     )}
//                   </span>
//                 </div> 
//               </div>

//               <div className="flex-1">
//                 <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                   Confirmar Nova Senha
//                 </label>
//                 <div className="relative">
//                   <input
//                     name="confirmarSenha"
//                     type={passwordConfirmeVisible ? "text" : "password"}
//                     value={confirmarSenha}
//                     className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                     placeholder="Digite sua senha"
//                     required
//                     onChange={(e) => setConfirmarSenha(e.target.value)}
//                   />
//                   <span
//                     onClick={() => setPasswordConfirmeVisible(!passwordConfirmeVisible)}
//                     className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                   >
//                     {passwordConfirmeVisible ? (
//                       <FaRegEyeSlash className="text-sky-400" />
//                     ) : (
//                       <MdOutlineRemoveRedEye className="text-sky-400" />
//                     )}
//                   </span>
//                 </div> 
//               </div>
//             </div>
//           </form>
//         </article>

//         <article className="flex flex-col gap-1 p-6 border-2 border-[var(--soft-presence)] rounded-md">
//           <div className="flex flex-col mb-4">
//             <h2 className="text-[var(--bright-azure)] text-[24px] font-semibold">
//               Configurações de Pagamento
//             </h2>
//             <p className="text-[var(--soft-cyan)] text-[16px] mb-4">
//               Configure como receber apoios
//             </p>
//           </div>

//           <form className="flex flex-col gap-4 md:flex-row">
//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 Chave PIX
//               </label>
//               <input
//                 type="text"
//                 name="chavePix"
//                 placeholder="Digite sua chave pix"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//                 onChange={(e) => setPix(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
//                 PayPal
//               </label>
//               <input
//                 type="email"
//                 name="paypal"
//                 placeholder="Digite seu email do PayPal"
//                 className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
//               />
//             </div>
//           </form>
//         </article>

//         <div className="flex flex-row gap-4 justify-between">

//            <DeleteAccountDialog/>
                    
//           <button
//             className="bg-sky-400 max-w-[200px] flex items-center gap-2 hover:bg-sky-300 text-black font-semibold py-2 px-4 rounded-lg focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 cursor-pointer"
//             onClick={() => salvarALteracoes()}
//           >
//             <FaSave />
//             <p> { salvandoPerfil ? "Salvando" : "Salvar" } </p>
//           </button>

//         </div>
//       </section>
//       {/* Add more settings related components or forms here */}
//     </main>
//   );
// }


// src/app/settings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { LoadingSpinner } from "@/components/Loading/spinner";
import { SettingsAlert } from "@/components/Alert/SettingsAlert";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { useAvatarSettings } from "@/hooks/useAvatarSettings";

// ← Importar componentes
import { SettingsHeader } from "@/components/Settings/SettingsHeader";
import { AvatarSection } from "@/components/Settings/AvatarSection";
import { ProfileInfoForm } from "@/components/Settings/ProfileInfoForm";
import { SocialLinksForm } from "@/components/Settings/SocialLinksForm";
import { AccountSettingsForm } from "@/components/Settings/AccountSettingsForm";
import { PaymentSettingsForm } from "@/components/Settings/PaymentSettingsForm";
import { SettingsActions } from "@/components/Settings/SettingsActions";

export default function SettingsPage() {
  const { status } = useSession();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const {
    formData,
    loading,
    paginaCarregada,
    alertMessage,
    handleSave,
    updateField,
    closeAlert,
  } = useSettingsForm();

  const {
    avatarAtual,
    avatarSelecionado,
    salvandoAvatar,
    avatarMudou,
    alertMessage: avatarAlertMessage,
    handleAvatarSelect,
    setAvatarSelecionado,
    handleAtualizarAvatar,
    closeAlert: closeAvatarAlert,
  } = useAvatarSettings();

  const avatars = [
    "/avatar1.jpg", "/avatar2.jpg"
  ];

  console.log("Status:", status, "Página carregada:", paginaCarregada); // ← DEBUG

  if (!paginaCarregada) {
    console.log("mostrando loading")
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  console.log("Renderizando página..."); // ← DEBUG

  return (
    <main className="bg-[var(--midnight-black)] flex items-center text-black min-h-screen flex-col p-2">
      
      {alertMessage && (
        <SettingsAlert
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
          onClose={closeAlert}
        />
      )}

      <section className="flex flex-col p-4 gap-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px]">
        
        <SettingsHeader />
        
        <AvatarSection
          avatarAtual={avatarAtual}
          avatarSelecionado={avatarSelecionado}
          salvandoAvatar={salvandoAvatar}
          avatarMudou={avatarMudou}
          avatars={avatars}
          onAvatarSelect={handleAvatarSelect} // ← CORRIGIDO
          onUpdateAvatar={handleAtualizarAvatar} // ← CORRIGIDO
        />
        
        <ProfileInfoForm
          nomeArtistico={formData.nomeArtistico}
          userName={formData.userName}
          bio={formData.bio}
          onUpdateField={updateField}
        />
        
        <SocialLinksForm
          instagram={formData.instagram}
          spotify={formData.spotify}
          youtube={formData.youtube}
          // soundcloud={formData.soundcloud}
          onUpdateField={updateField}
        />
        
        <AccountSettingsForm
          email={formData.email}
          senhaAtual={formData.senhaAtual}
          senhaNova={formData.senhaNova}
          confirmarSenha={formData.confirmarSenha}
          passwordVisible={passwordVisible}
          onUpdateField={updateField}
          onTogglePasswordVisibility={() => setPasswordVisible(!passwordVisible)}
        />
        
        <PaymentSettingsForm
          pixKey={formData.pixKey}
          pixName={formData.pixName}
          pixCity={formData.pixCity}
          onUpdateField={updateField}
        />
        
        <SettingsActions
          loading={loading}
          onSave={handleSave}
        />
        
      </section>
    </main>
  );
}