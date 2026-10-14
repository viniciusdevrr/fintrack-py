export default function PaginaEmBreve({ nome }: { nome: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-lg font-semibold text-[rgb(var(--text-primary))]">{nome}</p>
      <p className="mt-1 text-sm text-[rgb(var(--text-secondary))]">
        Essa seção chega nas próximas partes do projeto 🚧
      </p>
    </div>
  );
}