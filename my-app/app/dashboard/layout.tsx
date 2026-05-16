"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const isActive = (path: string) =>
    pathname === path
      ? "bg-white/[0.08] text-white"
      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]";

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: GridIcon },
    { href: "/dashboard/inventario", label: "Inventário", icon: BoxIcon },
    { href: "/dashboard/fornecedores", label: "Fornecedores", icon: TruckIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-60 bg-[#0B0F1A] flex-col fixed h-full border-r border-white/[0.06] z-20">
        {/* Logo */}
        <div className="mb-10 px-2">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          ESTOQUE<span className="text-[#4169E1]">PRO</span>
        </h1>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)}`}
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Usuário com menu */}
        <div className="p-3 border-t border-white/[0.06]" ref={menuRef}>
          <div className="relative">
            {/* Botão do usuário */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold ring-1 ring-indigo-500/30">
                AD
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-200">Admin</p>
                <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">
                  Online
                </p>
              </div>
              <ChevronIcon aberto={menuAberto} />
            </button>

            {/* Menu dropdown */}
            {menuAberto && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#12162B] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                <Link
                  href="/dashboard/configuracoes"
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors"
                >
                  <GearIcon />
                  Configurações
                </Link>
                <div className="border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    setMenuAberto(false);
                    // Aqui você pode adicionar a lógica de logout
                    // Ex: signOut() ou router.push("/login")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/[0.06] hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogoutIcon />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}

/* ─── Ícones SVG inline ─── */

function GridIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-60"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-60"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-60"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  );
}

function ChevronIcon({ aberto }: { aberto: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-slate-500 transition-transform ${aberto ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  );
}