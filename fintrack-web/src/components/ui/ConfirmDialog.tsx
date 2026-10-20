import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import Modal from "./Modal";

interface Props {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
  carregando?: boolean;
}

export default function ConfirmDialog({ aberto, titulo, mensagem, aoConfirmar, aoCancelar, carregando }: Props) {
  return (
    <Modal aberto={aberto} aoFechar={aoCancelar} titulo={titulo}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-300">{mensagem}</p>
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="ghost" className="flex-1" onClick={aoCancelar}>Cancelar</Button>
        <Button variant="danger" className="flex-1" onClick={aoConfirmar} loading={carregando}>Excluir</Button>
      </div>
    </Modal>
  );
}