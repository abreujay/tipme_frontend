// src/components/Settings/SettingsHeader.tsx
import Voltar from "@/components/Botoes/voltar";

export function SettingsHeader() {
  return (
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
  );
}