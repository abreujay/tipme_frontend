'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/Loading/spinner";
import Alert from "@/components/Alert/alert";

export default function Login() {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [erro, setErro] = useState("")
  const { data: session, status } = useSession();
 

   // Redireciona se já estiver autenticado
  useEffect(() => {
    if (status === "loading") return; // Ainda carregando
    if (session) {
      router.push("/home");
    }
  }, [session, status, router]);

  // Mostra loading enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  // Se já está autenticado, não mostra a página
  if (session) {
    return null;
  }

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro(""); // Limpa erros anteriores

    try {
       const result = await signIn("credentials", {
      redirect: false,
      userMail: email,
      userPassword: password,
    }); 

    if (result?.ok) {
      router.push("/home"); // Redireciona para uma rota protegida
    } else {
      setErro("Erro ao fazer login")
    }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro("Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
   
  };


  return (
    <div className="bg-black w-full h-screen flex items-center justify-center">
        { erro && (
            <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-[400px]">
              <Alert title="Erro" description={erro} onClose={() => setErro("")} />
            </div>
        )}   
      <div className="bg-black/80 border border-sky-300/20 p-10 rounded-lg shadow-md flex flex-col items-center w-[320px] sm:min-w-md">
        <h1 className="text-cyan-400 text-3xl font-bold mb-2"> Fazer Login </h1>
        <p className="text-cyan-200 text-[16px]">
                      Entre na sua conta para gerenciar seus apoios 
                    </p>
    
                    <form
                        onSubmit={handleLogin}
                        className="w-full max-w-md mt-6 "
                    >
                        <div className="mt-4">
                            <label className="block text-sky-200 mb-2">Email</label>
                            <input
                                name="email"
                                type="email"
                                className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                                placeholder="Digite seu email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
    
                        <div className="mt-4">
                            <label className="block text-sky-200 mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    className="w-full p-2 pr-10 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                                    placeholder="Digite sua senha"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span 
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                                    { passwordVisible ? <FaRegEyeSlash className="text-sky-400" /> : <MdOutlineRemoveRedEye className="text-sky-400" /> }
                                </span>
                            </div>
                        </div>
    
                        <button
                            type="submit"
                            className="mt-6 w-full bg-sky-400 hover:bg-sky-300 text-black font-semibold py-2 px-4 rounded-lg focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200">
                              { isLoading ? "Carregando..." : "Entrar" }
                        </button>
    
                        <p
                            className="mt-4 text-sky-300 text-sm text-center">
                            Não tem uma conta? <Link href="/cadastro"
                            className="text-sky-400 hover:text-sky-500"> Cadastre-se </Link>
                        </p>
                    </form>
                </div>
            </div>
  );
}
