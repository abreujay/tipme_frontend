// 'use client'

// import { profileService} from "@/services/profileServices";
// import { useState } from "react"


// type Props = {
//     params: Promise<{  // ← CORRIGIR: params é Promise
//         userId: string;
//     }>;
// }

// export default async function UserProfilePage({ params }: Props) {
//     // ← AGUARDAR OS PARAMS
//     const { userId } = await params;

//     const [valor, setValor] = useState<number>(0)
//     const [chavePix, setChavePix] = useState<string | null>(null)

//      function pegarPix(){
//         const response =  profileService.getPix({ userId: userId, value: valor }) // ← Substituir "token" pelo token real

//         if(!response){
//             console.log("erro ao buscar")
//         }

//         const data = await response.json()

//         const pixKey= data.pixKey

//         setChavePix(pixKey)
//     }

//     return (
//         <div className="min-h-screen bg-black text-white p-8">
//             <div className="max-w-2xl mx-auto">
//                 <h1 className="text-3xl font-bold mb-4 text-white">User Profile</h1>
//                 <p className="text-xl mb-8 text-white">User ID: {userId}</p>

//                 <div className="bg-gray-800 p-6 rounded-lg">
//                     <p className="text-white text-lg mb-4">💰 Quer fazer uma doação?</p>

//                     <form className="space-y-4"
//                     onSubmit={pegarPix}>
//                         <div>
//                             <label className="block text-white text-sm font-medium mb-2">
//                                 Valor (R$)
//                             </label>
//                             <input
//                                 type="number"
//                                 placeholder="Digite o valor"
//                                 min="1"
//                                 step="0.01"
//                                 className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 onChange={(e) => setValor(Number(e.target.value))}
//                             />
//                         </div>
                        
//                         <button
//                             type="submit"
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
//                         >
//                             💳 Fazer Doação
//                         </button>
//                     </form>                    

//                     {/* ← MOSTRAR CHAVE PIX QUANDO RECEBIDA */}
//                     {chavePix && (
//                         <div className="mt-6 p-4 bg-green-800/30 border border-green-500/30 rounded-lg">
//                             <h3 className="text-green-400 font-semibold mb-2">✅ Chave PIX encontrada:</h3>
//                             <div className="bg-gray-900 p-3 rounded-md">
//                                 <p className="text-white font-mono text-sm break-all">{chavePix}</p>
//                             </div>
//                             <div className="mt-3 flex gap-2">
//                                 <button
//                                     onClick={() => navigator.clipboard.writeText(chavePix)}
//                                     className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                                 >
//                                     📋 Copiar
//                                 </button>
//                                 <button
//                                     onClick={() => setChavePix(null)}
//                                     className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                                 >
//                                     🗑️ Limpar
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


// src/app/profile/[userId]/page.tsx
'use client'

import { profileService } from "@/services/profileServices";
import { useState, useEffect } from "react"

type Props = {
    params: Promise<{
        userId: string;
    }>;
}

export default function UserProfilePage({ params }: Props) { // ← REMOVIDO async
    const [userId, setUserId] = useState<string>(''); // ← ESTADO PARA userId
    const [valor, setValor] = useState<number>(0);
    const [chavePix, setChavePix] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // ← RESOLVER PARAMS NO useEffect
    useEffect(() => {
        params.then(({ userId }) => {
            setUserId(userId);
        });
    }, [params]);

    // ← FUNÇÃO CORRIGIDA
    async function pegarPix(e: React.FormEvent) {
        e.preventDefault(); // ← PREVENIR SUBMIT PADRÃO
        
        if (valor <= 0) {
            alert('Digite um valor válido');
            return;
        }

        setLoading(true);
        
        try {
            const response = await profileService.getPix({ userId: userId, value: valor });

            if (!response.ok) {
                throw new Error('Erro ao buscar PIX');
            }

            const data = await response.json();
            const pixKey = data.pixKey;

            setChavePix(pixKey);
            console.log('✅ Chave PIX recebida:', pixKey);
            
        } catch (error) {
            console.error('❌ Erro ao buscar PIX:', error);
            alert('Erro ao buscar PIX');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-white">User Profile</h1>
                <p className="text-xl mb-8 text-white">User ID: {userId || 'Carregando...'}</p>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="text-white text-lg mb-4">💰 Quer fazer uma doação?</p>

                    <form className="space-y-4" onSubmit={pegarPix}>
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Valor (R$)
                            </label>
                            <input
                                type="number"
                                value={valor} // ← CONTROLLED INPUT
                                placeholder="Digite o valor"
                                min="1"
                                step="0.01"
                                required
                                disabled={loading}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                onChange={(e) => setValor(Number(e.target.value))}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading || valor <= 0 || !userId}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors"
                        >
                            {loading ? '🔄 Buscando...' : '💳 Fazer Doação'}
                        </button>
                    </form>                    

                    {/* ← MOSTRAR CHAVE PIX QUANDO RECEBIDA */}
                    {chavePix && (
                        <div className="mt-6 p-4 bg-green-800/30 border border-green-500/30 rounded-lg">
                            <h3 className="text-green-400 font-semibold mb-2">✅ Chave PIX encontrada:</h3>
                            <div className="bg-gray-900 p-3 rounded-md">
                                <p className="text-white font-mono text-sm break-all">{chavePix}</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => navigator.clipboard.writeText(chavePix)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    📋 Copiar
                                </button>
                                <button
                                    onClick={() => setChavePix(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    🗑️ Limpar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}