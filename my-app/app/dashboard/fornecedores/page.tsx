"use client";

import { useState, useEffect } from "react";

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
  categoria: string;
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    contato: "",
    categoria: "",
  });

  const API_URL = "http://127.0.0.1:8000/api/fornecedores/";

  const carregarFornecedores = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFornecedores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores", error);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const salvarFornecedor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFornecedor),
      });
      if (!response.ok) {
        const erro = await response.json();
        alert("Erro: " + (erro.detail || response.statusText));
        return;
      }
      setModalAberto(false);
      setNovoFornecedor({ nome: "", contato: "", categoria: "" });
      carregarFornecedores();
    } catch (error) {
      alert(
        "Backend offline. Verifique se o servidor esta rodando na porta 8000."
      );
    }
  };

  const removerFornecedor = async (id: number) => {
    if (
      !confirm(
        "Tem certeza? Os produtos deste fornecedor ficarao 'Sem Fornecedor'."
      )
    )
      return;
    try {
      const res = await fetch(API_URL + id, { method: "DELETE" });
      if (res.ok) setFornecedores(fornecedores.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Erro ao remover", error);
    }
  };

  const filtrados = fornecedores.filter(
    (f) =>
      (f.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
      (f.categoria || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#0B0F1A]">
      {/* HEADER */}
      <header className="bg-[#0B0F1A] border-b border-white/[0.06] h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="relative w-80">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar fornecedor ou categoria..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.97] flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Novo Fornecedor
        </button>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total de Fornecedores
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {fornecedores.length}
            </p>
          </div>
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Categorias
              </span>
              <span className="text-lg opacity-60"></span>
            </div>
            <p className="text-2xl font-bold text-white">
              {[...new Set(fornecedores.map((f) => f.categoria))].length}
            </p>
          </div>
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Resultados
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{filtrados.length}</p>
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">
              Fornecedores
            </h2>
            <span className="text-xs text-slate-600">
              {filtrados.length} resultado
              {filtrados.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_140px_100px] gap-4 px-5 py-2.5 border-b border-white/[0.04] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span>Fornecedor</span>
            <span>Contato</span>
            <span>Categoria</span>
            <span className="text-right">Acoes</span>
          </div>

          {filtrados.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-600 text-sm">
                Nenhum fornecedor encontrado.
              </p>
            </div>
          ) : (
            filtrados.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-[1fr_1fr_140px_100px] gap-4 px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center group"
              >
                {/* Nome */}
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {f.nome}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">ID #{f.id}</p>
                </div>

                {/* Contato */}
                <div>
                  <span className="text-sm text-slate-400">{f.contato}</span>
                </div>

                {/* Categoria */}
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] text-slate-400 ring-1 ring-inset ring-white/[0.06]">
                    {f.categoria || "Geral"}
                  </span>
                </div>

                {/* Acoes */}
                <div className="flex items-center justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removerFornecedor(f.id)}
                    className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Remover"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL NOVO FORNECEDOR */}
      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="bg-[#12162B] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Novo Fornecedor
            </h2>
            <form onSubmit={salvarFornecedor} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Nome da Empresa
                </label>
                <input
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Ex: Ambev"
                  value={novoFornecedor.nome}
                  onChange={(e) =>
                    setNovoFornecedor({
                      ...novoFornecedor,
                      nome: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Contato
                </label>
                <input
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Telefone ou E-mail"
                  value={novoFornecedor.contato}
                  onChange={(e) =>
                    setNovoFornecedor({
                      ...novoFornecedor,
                      contato: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Categoria
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Ex: Bebidas"
                  value={novoFornecedor.categoria}
                  onChange={(e) =>
                    setNovoFornecedor({
                      ...novoFornecedor,
                      categoria: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-semibold rounded-lg transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}