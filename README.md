## Teste backend TXAI

### Execução do projeto

Para a correta execução do repositório em sua máquina local, é necessário possuir as seguintes dependências instaladas:
- Git
- Node v20.11.0
- PostgreSQL 16.2

Passos para a execução do projeto:
- Realize o clone do repositório projeto executando `git clone https://github.com/Syank/teste-backend-txai.git` em seu terminal
- Feito o clone do repositório, navegue até `src/test-backend-txai`
- Dentro de `src/test-backend-txai`, crie um arquivo nomeado `.env`
  - Este arquivo é responsável por configurar variáveis de ambiente para a execução do projeto Node
- Edite o arquivo `src/test-backend-txai/.env` e adicione a linha `DATABASE_URL=postgresql://<usuário>:<senha>@<host>:<porta>/<nome_do_banco>?schema=public`
  - Exemplo: `DATABASE_URL=postgresql://postgres:admin@localhost:5432/postgres?schema=public`
- Execute o comando `npm install` em seu terminal
  - Certifique-se de possuir Node 20.11.0 em sua máquina
- Após a instalação das dependências, execute o comando `npm run generate-database`
  - Este comando irá gerar o schema do banco de dados e criará o usuário administrador padrão com o login `sistematxai` e senha `123456789`
- Após a criação do schema do banco de dados, execute o comando `npm run start` para iniciar a aplicação

Para executar os testes, siga os mesmos passos para a execução normal, e para garantir que tudo está ok, após executar o comando `npm run start`, pare de executar a aplicação e execute o comando `npm run test`

