"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

export function DeleteAccountDialog() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className=" max-w-[200px] flex items-center gap-2 font-semibold text-[var(--error-icon)] py-2 px-4 border-2 border-[var(--error-border)] rounded-lg focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 cursor-pointer">
            <RiDeleteBin6Line />
            <p> Excluir Conta </p>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[var(--midnight-black)] border border-[var(--soft-presence)] [&>button]:text-white [&>button]:hover:bg-gray-700 [&>button]:p-2 [&>button]:rounded-md [&>button]:cursor-pointer">
          <DialogHeader className="text-[var(--soft-cyan)]">
            <DialogTitle> Tem certeza que deseja deletar a conta? </DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Você tem certeza que deseja
              continuar?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Senha
              </label>
              <div className="relative">
                <input
                  name="senha"
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                  placeholder="Digite sua senha"
                  required
                  // onChange={(e) => setSenhaNova(e.target.value)}
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {passwordVisible ? (
                    <FaRegEyeSlash className="text-sky-400" />
                  ) : (
                    <MdOutlineRemoveRedEye className="text-sky-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  name="confirmarSenha"
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                  placeholder="Digite sua senha"
                  required
                  //  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {passwordVisible ? (
                    <FaRegEyeSlash className="text-sky-400" />
                  ) : (
                    <MdOutlineRemoveRedEye className="text-sky-400" />
                  )}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex">
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/10 focus:outlinenone focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancelar
              </button>
            </DialogClose>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Deletar
            </button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
