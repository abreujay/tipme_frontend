"use client"

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
        <div>
            <h1> home page </h1>
            <button onClick={limparAutenticacao}>
                Sair da conta
            </button>
            <a href="/settings">
                Ir para configurações
            </a>
        </div>
    )
}