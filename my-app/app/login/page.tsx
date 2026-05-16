'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        setMensagem('Login realizado com sucesso. Redirecionando...');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setMensagem('E-mail ou senha incorretos.');
      }
    } catch {
      setMensagem('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">EstoquePro</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Acesse sua conta</p>

        {mensagem && (
          <p className={`text-sm mb-4 text-center ${mensagem.includes('sucesso') ? 'text-green-600 font-bold' : 'text-red-500'}`}>
            {mensagem}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Digite sua senha"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition mt-2"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-900">
          Ainda não tem conta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
