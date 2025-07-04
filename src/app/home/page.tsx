"use client"

import { LoginDialog } from "@/components/Dialog/LoginDialog";
import { signOut } from "next-auth/react";

export default function HomePage() {

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
        <div className="flex flex-col gap-2 items-center justify-center min-h-screen bg-gray-100">
            <h1> home page </h1>
            <button onClick={limparAutenticacao}>
                Sair da conta
            </button>
            
            <LoginDialog />
        </div>
    )
}