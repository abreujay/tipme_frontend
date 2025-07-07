import { BiCheck } from "react-icons/bi";

interface AvatarSectionProps {
  avatarAtual: string;
  avatarSelecionado: string;
  salvandoAvatar: boolean;
  avatars: string[];
  onAvatarSelect: (avatar: string) => void;
  onUpdateAvatar: () => void;
}

export function AvatarSection({
  avatarAtual,
  avatarSelecionado,
  salvandoAvatar,
  avatars,
  onAvatarSelect,
  onUpdateAvatar,
}: AvatarSectionProps) {
  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4">
        Avatar
      </h2>
      
      <div className="flex flex-col items-center gap-4">
        <img
          src={avatarSelecionado || avatarAtual}
          alt="Avatar atual"
          className="w-24 h-24 rounded-full border-2 border-[var(--bright-azure)]"
        />
        
        <div className="grid grid-cols-4 gap-2">
          {avatars.map((avatar, index) => (
            <div key={index} className="relative">
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all ${
                  avatarSelecionado === avatar
                    ? "border-[var(--bright-azure)] scale-110"
                    : "border-transparent hover:border-[var(--soft-cyan)]"
                }`}
                onClick={() => onAvatarSelect(avatar)}
              />
              {avatarSelecionado === avatar && (
                <div className="absolute inset-0 bg-sky-400/20 flex items-center justify-center rounded-full">
                  <BiCheck className="w-6 h-6 text-sky-400" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={onUpdateAvatar}
          disabled={salvandoAvatar || !avatarSelecionado || avatarSelecionado === avatarAtual}
          className="bg-[var(--bright-azure)] hover:bg-[var(--soft-cyan)] text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {salvandoAvatar ? "Salvando..." : "Atualizar Avatar"}
        </button>
      </div>
    </article>
  );
}