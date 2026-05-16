'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentimento, setConsentimento] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    if (!consentimento) {
      setMensagem('Você precisa aceitar a Política de Privacidade para continuar.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Conta criada com sucesso! Redirecionando para o login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMensagem(data.detail || 'Erro ao cadastrar.');
      }
    } catch {
      setMensagem('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">EstoquePro</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Crie sua nova conta</p>

        {mensagem && (
          <p className={`text-sm mb-4 text-center ${mensagem.includes('sucesso') ? 'text-green-600 font-bold' : 'text-red-500'}`}>
            {mensagem}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Senha</label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {/* Consentimento LGPD — Art. 8, Lei 13.709/2018 */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="lgpd-consent"
              checked={consentimento}
              onChange={(e) => setConsentimento(e.target.checked)}
              className="mt-0.5 accent-blue-600"
            />
            <label htmlFor="lgpd-consent" className="text-xs text-gray-600 leading-relaxed">
              Li e aceito a{' '}
              <a href="/privacidade" target="_blank" className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>
              . Concordo com o tratamento dos meus dados (e-mail) para fins de autenticação e uso do sistema, conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition mt-2 disabled:opacity-50"
            disabled={!consentimento}
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-900">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Faça login</a>
        </p>
      </div>
    </div>
  );
}
