export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">EstoquePro &mdash; Atualizado em maio de 2025</p>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">1. Controlador dos dados</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            O EstoquePro é o controlador responsável pelo tratamento dos seus dados pessoais,
            nos termos do Art. 5º, VI, da Lei 13.709/2018 (LGPD).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">2. Dados coletados</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Coletamos exclusivamente o endereço de e-mail fornecido no cadastro. Não coletamos
            dados sensíveis, localização, dados de menores ou qualquer outra informação além
            da estritamente necessária para a autenticação no sistema.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">3. Finalidade e base legal</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Seus dados são utilizados exclusivamente para autenticação e acesso ao sistema
            de gestão de estoque. A base legal para o tratamento é o seu consentimento
            explícito (Art. 7º, I, da LGPD), coletado no momento do cadastro.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">4. Compartilhamento</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Seus dados não são vendidos, alugados ou compartilhados com terceiros para fins
            comerciais. O acesso é restrito aos sistemas necessários para o funcionamento
            da aplicação (banco de dados seguro em nuvem).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">5. Segurança</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Senhas são armazenadas exclusivamente em formato hash (bcrypt). O tráfego entre
            o navegador e o servidor utiliza conexão segura (HTTPS em produção). Tokens de
            acesso expiram automaticamente após 60 minutos.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">6. Seus direitos (LGPD, Arts. 17-22)</h2>
          <ul className="text-sm text-gray-700 leading-relaxed list-disc pl-5 space-y-1">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar os dados que armazenamos sobre você;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a exclusão dos seus dados (direito ao esquecimento);</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail indicado
            no rodapé desta página.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">7. Retenção de dados</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Os dados são mantidos enquanto a conta estiver ativa. Após a solicitação de
            exclusão, os dados são removidos permanentemente em até 15 dias úteis.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">8. Contato</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Dúvidas, solicitações ou reclamações relacionadas a esta política podem ser
            enviadas para o responsável pelo tratamento de dados (encarregado / DPO)
            através do e-mail disponível na documentação do projeto.
          </p>
        </section>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <a href="/register" className="text-sm text-blue-600 hover:underline">
            &larr; Voltar ao cadastro
          </a>
        </div>
      </div>
    </div>
  );
}
