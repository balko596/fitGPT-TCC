import React from 'react';
import { motion } from 'framer-motion';
import { Database, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const SupabaseSetupPage: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Configurar Supabase</h1>
          <p className="text-lg text-gray-600">
            Configure o Supabase para sincronizar seus dados entre dispositivos
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Modo Offline Ativo</h3>
              <p className="text-amber-700 text-sm">
                Atualmente o FitGPT está funcionando em modo offline. Seus dados são salvos apenas no navegador atual. 
                Para sincronizar dados entre dispositivos, configure o Supabase seguindo as instruções abaixo.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Passo 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold">Criar Conta no Supabase</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Acesse o Supabase e crie uma conta gratuita. O plano gratuito é suficiente para uso pessoal.
            </p>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Acessar Supabase
            </a>
          </div>

          {/* Passo 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold">Criar Novo Projeto</h2>
            </div>
            <p className="text-gray-600 mb-4">
              No dashboard do Supabase, clique em "New Project" e configure:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Nome do projeto: <code className="bg-gray-100 px-2 py-1 rounded">FitGPT</code></li>
              <li>Senha do banco: Crie uma senha segura</li>
              <li>Região: Escolha a mais próxima de você</li>
            </ul>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Importante:</strong> Anote a senha do banco, você precisará dela para acessar o banco de dados.
              </p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                3
              </div>
              <h2 className="text-xl font-semibold">Executar Migrações do Banco</h2>
            </div>
            <p className="text-gray-600 mb-4">
              No seu projeto Supabase, vá para "SQL Editor" e execute as seguintes migrações na ordem:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Migração Principal:</h4>
                <div className="bg-gray-100 p-3 rounded-lg relative">
                  <button
                    onClick={() => copyToClipboard('20250616060350_curly_field.sql')}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                    title="Copiar nome do arquivo"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <code className="text-sm">20250616060350_curly_field.sql</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Dados de Exemplo:</h4>
                <div className="bg-gray-100 p-3 rounded-lg relative">
                  <button
                    onClick={() => copyToClipboard('20250616060847_wild_plain.sql')}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                    title="Copiar nome do arquivo"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <code className="text-sm">20250616060847_wild_plain.sql</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Agendamento:</h4>
                <div className="bg-gray-100 p-3 rounded-lg relative">
                  <button
                    onClick={() => copyToClipboard('20250618005613_noisy_sky.sql')}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                    title="Copiar nome do arquivo"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <code className="text-sm">20250618005613_noisy_sky.sql</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">4. Estatísticas:</h4>
                <div className="bg-gray-100 p-3 rounded-lg relative">
                  <button
                    onClick={() => copyToClipboard('20250618010200_raspy_gate.sql')}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                    title="Copiar nome do arquivo"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <code className="text-sm">20250618010200_raspy_gate.sql</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">5. Configuração Final:</h4>
                <div className="bg-gray-100 p-3 rounded-lg relative">
                  <button
                    onClick={() => copyToClipboard('20250618015255_heavy_gate.sql')}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                    title="Copiar nome do arquivo"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <code className="text-sm">20250618015255_heavy_gate.sql</code>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg mt-4">
              <p className="text-yellow-800 text-sm">
                <strong>Dica:</strong> Copie o conteúdo de cada arquivo da pasta <code>supabase/migrations/</code> 
                e execute no SQL Editor do Supabase na ordem mostrada acima.
              </p>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                4
              </div>
              <h2 className="text-xl font-semibold">Obter Chaves da API</h2>
            </div>
            <p className="text-gray-600 mb-4">
              No seu projeto Supabase, vá para "Settings" → "API" e copie:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li><strong>Project URL:</strong> URL do seu projeto</li>
              <li><strong>anon public key:</strong> Chave pública para autenticação</li>
            </ul>
          </div>

          {/* Passo 5 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                5
              </div>
              <h2 className="text-xl font-semibold">Configurar Variáveis de Ambiente</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Crie um arquivo <code>.env</code> na raiz do projeto com:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
              <button
                onClick={() => copyToClipboard(`VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui`)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded text-white"
                title="Copiar configuração"
              >
                <Copy className="w-4 h-4" />
              </button>
              <div>VITE_SUPABASE_URL=sua_project_url_aqui</div>
              <div>VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui</div>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Substitua os valores pelas chaves obtidas no passo anterior.
            </p>
          </div>

          {/* Passo 6 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                6
              </div>
              <h2 className="text-xl font-semibold">Reiniciar a Aplicação</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Após configurar as variáveis de ambiente, reinicie o servidor de desenvolvimento:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
              <button
                onClick={() => copyToClipboard('npm run dev')}
                className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded text-white"
                title="Copiar comando"
              >
                <Copy className="w-4 h-4" />
              </button>
              <div>npm run dev</div>
            </div>
          </div>

          {/* Verificação */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800 mb-2">Verificar Configuração</h3>
                <p className="text-green-700 text-sm mb-3">
                  Após reiniciar, a aplicação deve conectar automaticamente ao Supabase. 
                  Você pode verificar se está funcionando:
                </p>
                <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                  <li>Criando uma nova conta - ela deve ser salva no Supabase</li>
                  <li>Editando seu perfil - as alterações devem persistir entre navegadores</li>
                  <li>Adicionando treinos aos favoritos - devem sincronizar entre dispositivos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao FitGPT
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SupabaseSetupPage;