import { Logo } from "@/components/ui/Logo";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <a
          href="/dashboard"
          aria-label="Ir para o dashboard do Valuation Copilot BR"
          className="inline-flex items-center rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Logo variant="full" size="md" className="hidden sm:inline-flex" />
          <Logo variant="compact" size="md" className="sm:hidden" />
        </a>

        {/* Restante da navbar */}
      </div>
    </header>
  );
}
