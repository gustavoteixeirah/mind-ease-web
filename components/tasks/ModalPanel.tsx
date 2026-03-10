import { X } from "lucide-react";

interface ModalPanelProps {
  onClose: () => void;
  mode: "create" | "details";
}

export default function ModalPanel({ onClose, mode }: ModalPanelProps) {
  return (
    <header className="flex items-center justify-between px-6 pt-6 pb-8">
      <h2 className="text-[18px] text-[#1D1A1A]">
        {mode === "create" ? "Criar nova tarefa" : "Detalhes da tarefa"}
      </h2>
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="text-[#DDD9DA] hover:cursor-pointer hover:text-[#757373] transition-colors"
      >
        <X />
      </button>
    </header>
  );
}
