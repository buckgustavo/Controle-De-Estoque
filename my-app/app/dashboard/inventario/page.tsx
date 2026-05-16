"use client";

import { useState, useEffect } from "react";

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  categoria: string;
}

export default function InventarioPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/items/")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatus = (qtd: number) => {
    if (qtd <= 0)
      return {
        label: "Esgotado",
        cor: "bg-red-500/10 text-red-500 ring-red-500/20",
      };
    if (qtd <= 5)
      return {
        label: "Reposicao",
        cor: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
      };
    if (qtd <= 20)
      return {
        label: "Baixo",
        cor: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
      };
    return {
      label: "Saudavel",
      cor: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    };
  };

  const totalUnidades = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const precisamReposicao = produtos.filter((p) => p.quantidade <= 5).length;
  const categorias = [...new Set(produtos.map((p) => p.categoria))].length;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#0B0F1A]">
      {/* HEADER */}
      <header className="bg-[#0B0F1A] border-b border-white/[0.06] h-16 flex items-center px-6 sticky top-0 z-10">
        <h1 className="text-sm font-semibold text-slate-300">
          Relatorio de Inventario
        </h1>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Itens Cadastrados
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{produtos.length}</p>
          </div>
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total de Unidades
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{totalUnidades}</p>
          </div>
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Categorias
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{categorias}</p>
          </div>
          <div
            className={
              precisamReposicao > 0
                ? "rounded-xl border bg-red-500/[0.04] border-red-500/20 p-4"
                : "rounded-xl border bg-white/[0.02] border-white/[0.06] p-4"
            }
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Precisam Reposicao
              </span>
            </div>
            <p
              className={
                precisamReposicao > 0
                  ? "text-2xl font-bold text-red-400"
                  : "text-2xl font-bold text-white"
              }
            >
              {precisamReposicao}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">
              Carregando inventario...
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300">
                Inventario Completo
              </h2>
              <span className="text-xs text-slate-600">
                {produtos.length} ite{produtos.length !== 1 ? "ns" : "m"}
              </span>
            </div>

            {/* Header da tabela */}
            <div className="grid grid-cols-[1fr_140px_120px_120px] gap-4 px-5 py-2.5 border-b border-white/[0.04] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Produto</span>
              <span>Categoria</span>
              <span className="text-center">Saldo</span>
              <span className="text-center">Status</span>
            </div>

            {produtos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-600 text-sm">
                  Nenhum item no inventario.
                </p>
              </div>
            ) : (
              produtos.map((p) => {
                const status = getStatus(p.quantidade);
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[1fr_140px_120px_120px] gap-4 px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center"
                  >
                    {/* Produto */}
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {p.nome}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        ID #{p.id}
                      </p>
                    </div>

                    {/* Categoria */}
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] text-slate-400 ring-1 ring-inset ring-white/[0.06]">
                        {p.categoria || "Geral"}
                      </span>
                    </div>

                    {/* Saldo */}
                    <div className="text-center">
                      <span
                        className={
                          p.quantidade <= 5
                            ? "text-sm font-bold tabular-nums text-red-400"
                            : "text-sm font-bold tabular-nums text-slate-200"
                        }
                      >
                        {p.quantidade}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <span
                        className={
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ring-1 ring-inset " +
                          status.cor
                        }
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}