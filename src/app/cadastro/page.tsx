'use client';

import { useState } from "react";


import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import CadastrarUsuario from "./actions";




export default function CadastroPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div
        className="bg-black w-full h-screen flex items-center justify-center">
            <div
            className="bg-black/80 border border-sky-300/20 p-8 rounded-lg shadow-md flex flex-col items-center w-[320px] sm:min-w-md">
                <h1
                className="text-cyan-400 text-3xl font-bold mb-2"> Criar Conta </h1>
                <p className="text-cyan-200 text-[16px]"> Cadastre-se para começar a receber apoio dos seus fãs </p>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const formData = new FormData(form);
                        await CadastrarUsuario(formData);
                    }}
                    className="w-full max-w-md mt-6 "
                >
                    <div className="mt-4">
                        <label className="block text-sky-200 mb-2">Nome</label>
                        <input
                            name="name"
                            type="text"
                            className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                            placeholder="Digite seu nome"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sky-200 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                            placeholder="Digite seu email"
                            required
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
                        Criar Conta
                    </button>

                    <p
                        className="mt-4 text-sky-300 text-sm text-center">
                        Já tem uma conta? <a href="/login" className="text-sky-400 hover:text-sky-500">Faça login</a>
                    </p>
                </form>
            </div>
        </div>
    )
}