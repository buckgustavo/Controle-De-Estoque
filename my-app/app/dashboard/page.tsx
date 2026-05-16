"use client";

import { useState, useEffect } from "react";

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  categoria: string;
  fornecedor_id?: number | null;
}

interface Fornecedor {
  id: number;
  nome: string;
}

export default function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [novoItem, setNovoItem] = useState({
    nome: "",
    quantidade: 1,
    categoria: "",
    fornecedor_id: "",
  });

  const [modalEdicao, setModalEdicao] = useState(false);
  const [itemEditando, setItemEditando] = useState<Produto | null>(null);
  const [formEdicao, setFormEdicao] = useState({
    nome: "",
    quantidade: 0,
    categoria: "",
    fornecedor_id: "",
  });

  const API_BASE = "http://127.0.0.1:8000/api";

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resProd, resForn] = await Promise.all([
        fetch(API_BASE + "/items/"),
        fetch(API_BASE + "/fornecedores/"),
      ]);
      const dadosProd = await resProd.json();
      const dadosForn = await resForn.json();
      setProdutos(Array.isArray(dadosProd) ? dadosProd : []);
      setFornecedores(Array.isArray(dadosForn) ? dadosForn : []);
    } catch (error) {
      console.error("Erro ao conectar com o backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const nomeFornecedor = (id?: number | null) => {
    if (!id) return null;
    const f = fornecedores.find((f) => f.id === id);
    return f ? f.nome : null;
  };

  const salvarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE + "/items/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoItem.nome,
          quantidade: novoItem.quantidade,
          categoria: novoItem.categoria,
          fornecedor_id: novoItem.fornecedor_id
            ? parseInt(novoItem.fornecedor_id)
            : null,
        }),
      });
      if (!response.ok) {
        const erro = await response.json();
        alert("Erro: " + (erro.detail || response.statusText));
        return;
      }
      setModalAberto(false);
      setNovoItem({ nome: "", quantidade: 1, categoria: "", fornecedor_id: "" });
      carregarDados();
    } catch (error) {
      alert("Backend offline. Verifique se o servidor esta rodando na porta 8000.");
    }
  };

  const abrirEdicao = (produto: Produto) => {
    setItemEditando(produto);
    setFormEdicao({
      nome: produto.nome,
      quantidade: produto.quantidade,
      categoria: produto.categoria,
      fornecedor_id: produto.fornecedor_id ? String(produto.fornecedor_id) : "",
    });
    setModalEdicao(true);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEditando) return;
    try {
      const response = await fetch(API_BASE + "/items/" + itemEditando.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formEdicao.nome,
          quantidade: Number(formEdicao.quantidade),
          categoria: formEdicao.categoria,
          fornecedor_id: formEdicao.fornecedor_id
            ? parseInt(formEdicao.fornecedor_id)
            : null,
        }),
      });
      if (!response.ok) {
        const erro = await response.json();
        alert("Erro: " + (erro.detail || response.statusText));
        return;
      }
      setModalEdicao(false);
      setItemEditando(null);
      carregarDados();
    } catch (error) {
      alert("Erro de conexao com o servidor.");
    }
  };

  const darBaixa = async (id: number, quantidadeAtual: number) => {
    if (quantidadeAtual <= 0) {
      alert("O estoque ja esta zerado!");
      return;
    }
    try {
      const res = await fetch(
        API_BASE + "/items/" + id + "/movimentar?quantidade_alterada=-1",
        { method: "PUT" }
      );
      if (res.ok) {
        setProdutos(
          produtos.map((p) =>
            p.id === id ? { ...p, quantidade: p.quantidade - 1 } : p
          )
        );
      }
    } catch (error) {
      console.error("Erro ao dar baixa", error);
    }
  };

  const removerItem = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar este item permanentemente?"))
      return;
    try {
      const res = await fetch(API_BASE + "/items/" + id, { method: "DELETE" });
      if (res.ok) setProdutos(produtos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao remover", error);
    }
  };

  const filtrados = produtos.filter(
    (p) =>
      (p.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
      (p.categoria || "").toLowerCase().includes(busca.toLowerCase())
  );

  const getStatus = (qtd: number) => {
    if (qtd <= 0)
      return {
        label: "Esgotado",
        cor: "bg-red-500/10 text-red-500 ring-red-500/20",
      };
    if (qtd <= 5)
      return {
        label: "Critico",
        cor: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
      };
    if (qtd <= 20)
      return {
        label: "Baixo",
        cor: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
      };
    return {
      label: "Normal",
      cor: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    };
  };

  const totalItens = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const criticos = produtos.filter((p) => p.quantidade <= 5).length;
  const categorias = [...new Set(produtos.map((p) => p.categoria))].length;

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
            placeholder="Buscar por nome ou categoria..."
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
          Novo Item
        </button>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total de Produtos
              </span>
              <span className="text-lg opacity-60"></span>
            </div>
            <p className="text-2xl font-bold text-white">{produtos.length}</p>
          </div>
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Unidades em Estoque
              </span>
              <span className="text-lg opacity-60"></span>
            </div>
            <p className="text-2xl font-bold text-white">{totalItens}</p>
          </div>
          <div className="rounded-xl border bg-white/[0.02] border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Categorias
              </span>
              <span className="text-lg opacity-60"></span>
            </div>
            <p className="text-2xl font-bold text-white">{categorias}</p>
          </div>
          <div
            className={
              criticos > 0
                ? "rounded-xl border bg-red-500/[0.04] border-red-500/20 p-4"
                : "rounded-xl border bg-white/[0.02] border-white/[0.06] p-4"
            }
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estoque Critico
              </span>
              <span className="text-lg opacity-60"></span>
            </div>
            <p
              className={
                criticos > 0
                  ? "text-2xl font-bold text-red-400"
                  : "text-2xl font-bold text-white"
              }
            >
              {criticos}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">
              Carregando estoque...
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300">Produtos</h2>
              <span className="text-xs text-slate-600">
                {filtrados.length} resultado
                {filtrados.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Header da tabela */}
            <div className="grid grid-cols-[1fr_120px_140px_140px_100px_160px] gap-4 px-5 py-2.5 border-b border-white/[0.04] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Produto</span>
              <span className="text-center">Quantidade</span>
              <span>Categoria</span>
              <span>Fornecedor</span>
              <span className="text-center">Status</span>
              <span className="text-right">Acoes</span>
            </div>

            {filtrados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-600 text-sm">
                  Nenhum item encontrado.
                </p>
              </div>
            ) : (
              filtrados.map((produto) => {
                const status = getStatus(produto.quantidade);
                const fornecedor = nomeFornecedor(produto.fornecedor_id);
                return (
                  <div
                    key={produto.id}
                    className="grid grid-cols-[1fr_120px_140px_140px_100px_160px] gap-4 px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {produto.nome}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        ID #{produto.id}
                      </p>
                    </div>

                    <div className="text-center">
                      <span
                        className={
                          produto.quantidade <= 5
                            ? "text-sm font-bold tabular-nums text-red-400"
                            : "text-sm font-bold tabular-nums text-slate-200"
                        }
                      >
                        {produto.quantidade}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] text-slate-400 ring-1 ring-inset ring-white/[0.06]">
                        {produto.categoria || "Sem categoria"}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500">
                        {fornecedor || "Sem fornecedor"}
                      </span>
                    </div>

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

                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => abrirEdicao(produto)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors"
                        title="Editar"
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => darBaixa(produto.id, produto.quantidade)}
                        className="p-1.5 rounded-md hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Dar baixa (-1)"
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
                            d="M19.5 12h-15"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => removerItem(produto.id)}
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
                );
              })
            )}
          </div>
        )}
      </div>

      {/* MODAL NOVO ITEM */}
      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="bg-[#12162B] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-6">Novo Produto</h2>
            <form onSubmit={salvarItem} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Nome
                </label>
                <input
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Ex: Monitor Dell 24"
                  value={novoItem.nome}
                  onChange={(e) =>
                    setNovoItem({ ...novoItem, nome: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
                    value={novoItem.quantidade}
                    onChange={(e) =>
                      setNovoItem({
                        ...novoItem,
                        quantidade: parseInt(e.target.value) || 0,
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
                    placeholder="Ex: Eletronico"
                    value={novoItem.categoria}
                    onChange={(e) =>
                      setNovoItem({ ...novoItem, categoria: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Fornecedor (opcional)
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-400 outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                  value={novoItem.fornecedor_id}
                  onChange={(e) =>
                    setNovoItem({ ...novoItem, fornecedor_id: e.target.value })
                  }
                >
                  <option value="">Nenhum</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
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

      {/* MODAL EDITAR ITEM */}
      {modalEdicao && itemEditando && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={() => setModalEdicao(false)}
        >
          <div
            className="bg-[#12162B] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Editar Produto</h2>
              <span className="text-xs text-slate-600">
                ID #{itemEditando.id}
              </span>
            </div>
            <form onSubmit={salvarEdicao} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Nome
                </label>
                <input
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
                  value={formEdicao.nome}
                  onChange={(e) =>
                    setFormEdicao({ ...formEdicao, nome: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
                    value={formEdicao.quantidade}
                    onChange={(e) =>
                      setFormEdicao({
                        ...formEdicao,
                        quantidade: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Categoria
                  </label>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
                    value={formEdicao.categoria}
                    onChange={(e) =>
                      setFormEdicao({ ...formEdicao, categoria: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Fornecedor
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-400 outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                  value={formEdicao.fornecedor_id}
                  onChange={(e) =>
                    setFormEdicao({
                      ...formEdicao,
                      fornecedor_id: e.target.value,
                    })
                  }
                >
                  <option value="">Nenhum</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalEdicao(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-semibold rounded-lg transition-all"
                >
                  Salvar Alteracoes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}