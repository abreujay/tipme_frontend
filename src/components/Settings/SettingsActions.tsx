// src/components/Settings/SettingsActions.tsx
import { FaSave } from "react-icons/fa";
import { DeleteAccountDialog } from "@/components/Dialog/deleteAccountDialog";

interface SettingsActionsProps {
  loading: boolean;
  onSave: () => void;
}

export function SettingsActions({ loading, onSave }: SettingsActionsProps) {
  return (
    <div className="flex flex-row gap-4 justify-between">
      <DeleteAccountDialog />
      
      <button
        onClick={onSave}
        disabled={loading}
        className="bg-sky-400 max-w-[200px] flex items-center gap-2 hover:bg-sky-300 text-black font-semibold py-2 px-4 rounded-lg focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 cursor-pointer disabled:opacity-50"
      >
        <FaSave />
        <p>{loading ? "Salvando..." : "Salvar"}</p>
      </button>
    </div>
  );
}