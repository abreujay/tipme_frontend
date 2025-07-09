"use client"

import { LoginDialog } from "@/components/Dialog/LoginDialog";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";

interface TokenPayload {
    userId: string;
}

export default function HomePage() {

   const { data: session } = useSession();
   const [userId, setUserId] = useState<string | null>(null);

   useEffect(() => {
       if (session?.accessToken) {

        try {
           //decodificar o token JWT
           const decoded = jwtDecode<TokenPayload>(session.accessToken);
           console.log("User ID:", decoded.userId);

           //extrair o userId do token JWT
           const userIdFromToken = decoded.userId;
           console.log("User ID from token:", userIdFromToken);

           setUserId(userIdFromToken);
       } catch (error) {
           console.error("Erro ao decodificar o token JWT:", error);
           setUserId(null);
       }
    } else {
        console.log("Nenhum token JWT encontrado na sessão.");
        setUserId(null);
    }
   }, [session]);

        // Função para limpar tudo e redirecionar
    const limparAutenticacao = async () => {
    await signOut({ 
        redirect: false // Não redireciona automaticamente
    });
    
    // Opcional: limpar localStorage/sessionStorage também
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirecionar manualmente
    window.location.href = '/cadastro';
    };

    return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-screen bg-black">
            <h1 className="text-white"> home page </h1>

              {/* ← MOSTRAR INFORMAÇÕES DO TOKEN */}
            {userId ? (
                <div className="text-white bg-gray-800 p-4 rounded-lg">
                <p>👤 User ID: {userId}</p>
                <p>📧 Email: {session?.user?.email}</p>
                <p>🔐 Token: {session?.accessToken?.substring(0, 20)}...</p>
                </div>
            ) : (
                <p className="text-white">❌ Usuário não autenticado</p>
            )}

            <button onClick={limparAutenticacao} className="text-white">
                Sair da conta
            </button>

            <Link href={`/profile/${userId}`}>
                <button className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">
                    Ir para o perfil-
                </button>
            </Link>
            
            <LoginDialog />
        </div>
    )
}