// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar do zero
    setErro('');

    try {
      // O FastAPI com OAuth2 espera os dados no formato URL Encoded (não JSON puro)
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', senha);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Salva o token no localStorage (num cenário avançado, usaríamos cookies HTTP-only)
      localStorage.setItem('tokenEstoquePro', data.access_token);
      
      // Joga o usuário direto pro Dashboard!
      router.push('/dashboard');
      
    } catch (err) {
      setErro('Deu ruim no login. Verifica o email e a senha aí.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">EstoquePro</h2>
        
        {erro && <p className="text-red-500 text-sm mb-4 text-center">{erro}</p>}
        
        <form onSubmit={fazerLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-00 text-sm font-bold mb-2">Senha</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}