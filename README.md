# 🏃 Corra Por Você — Desafio Virtual

Plataforma web para gerenciamento de um **desafio virtual de corrida e caminhada**, permitindo inscrição de participantes, acompanhamento de quilometragem, envio de comprovantes de atividades e validação administrativa.

O projeto foi desenvolvido com foco em simplicidade, experiência mobile e controle das atividades realizadas pelos participantes.

---

## 🎯 Objetivo

O **Corra Por Você** permite que cada participante escolha uma meta de distância e acompanhe sua evolução durante o período do desafio.

As atividades são registradas pelo participante através do envio de um comprovante, como um print de aplicativo de corrida ou caminhada, e posteriormente analisadas pela administração.

Somente atividades aprovadas entram na quilometragem oficial do participante.

---

## ✨ Principais funcionalidades

### 📝 Inscrição

- Cadastro online de participantes
- Nome
- E-mail
- WhatsApp
- Equipe/assessoria
- Escolha da modalidade
- Validação dos campos
- Bloqueio de inscrições duplicadas por e-mail
- Contagem de participantes

---

### 💳 Pagamento

Valor da inscrição:

**R$ 20,00**

Pagamento através de **PIX**, com recurso para copiar a chave diretamente pela interface.

> A chave PIX utilizada em produção deve ser configurada na aplicação sem inclusão de credenciais ou dados secretos no repositório.

---

## 🏃 Área do participante

O participante possui uma área própria para acompanhar o desafio.

Entre as informações disponíveis estão:

- modalidade escolhida;
- meta total;
- quilômetros concluídos;
- quilômetros restantes;
- percentual do desafio;
- barra de progresso;
- histórico de atividades.

---

## 📸 Registro de atividades

O participante pode registrar uma atividade informando dados como:

- data;
- distância;
- tempo;
- comprovante da atividade.

O comprovante pode ser um print de aplicativos utilizados para registrar corrida ou caminhada.

Após o envio:

```text
Participante
      ↓
Envia atividade
      ↓
Comprovante armazenado
      ↓
PENDENTE
      ↓
Administrador analisa
      ↓
APROVADA ou REJEITADA
```

Uma atividade pendente **não altera a quilometragem oficial**.

---

## ✅ Validação administrativa

O painel administrativo permite:

- visualizar atividades pendentes;
- consultar dados do participante;
- visualizar o comprovante;
- conferir distância e tempo;
- aprovar atividade;
- rejeitar atividade;
- informar observações;
- consultar atividades aprovadas;
- consultar atividades rejeitadas.

Quando uma atividade é aprovada, sua distância é incorporada ao progresso oficial do participante.

---

## 🔐 Área administrativa

O acesso administrativo utiliza autenticação através do **Supabase Auth**.

O fluxo de autorização foi estruturado como:

```text
Login
  ↓
Supabase Auth
  ↓
Sessão autenticada
  ↓
Verificação em admin_users
  ↓
Administrador ativo
  ↓
Painel administrativo
```

Usuários não autorizados não devem possuir acesso às operações administrativas.

---

## 🔒 Segurança

O projeto adota separação entre credenciais públicas do frontend e credenciais privilegiadas do backend.

### Frontend

Pode utilizar somente configurações públicas apropriadas do Supabase.

### Backend

Operações privilegiadas são executadas através de **Supabase Edge Functions**.

Credenciais como:

```text
SUPABASE_SERVICE_ROLE_KEY
STRAVA_CLIENT_SECRET
```

**nunca devem ser adicionadas ao código frontend ou versionadas no GitHub.**

---

## ⚡ Edge Functions

A arquitetura utiliza Supabase Edge Functions para operações que exigem processamento no backend.

Entre as funções desenvolvidas estão operações relacionadas a:

```text
atividades-admin
atividade-validar
```

Essas funções dão suporte ao fluxo administrativo de consulta e validação das atividades.

---

## 🗄️ Banco de dados

O projeto utiliza **Supabase/PostgreSQL**.

Entre as estruturas utilizadas estão:

### `inscricoes`

Armazena os participantes e seu progresso no desafio.

### `atividades`

Armazena as atividades enviadas pelos participantes.

### `admin_users`

Controla quais usuários autenticados possuem permissão administrativa.

### `strava_oauth_states`

Estrutura desenvolvida durante os testes da integração OAuth com Strava.

### `strava_conexoes`

Estrutura destinada à integração com contas Strava.

---

## 🟠 Integração com Strava

Durante o desenvolvimento foi estudada uma integração através de OAuth com o Strava.

A arquitetura prevista utiliza:

```text
Participante
      ↓
OAuth Strava
      ↓
Authorization Code
      ↓
Edge Function
      ↓
Access Token / Refresh Token
      ↓
Consulta de atividades
```

Para o MVP, foi adotado como fluxo principal o **envio manual do comprovante da atividade**, seguido da validação administrativa.

A integração automática com Strava permanece como possibilidade de evolução futura.

---

## 📱 PWA

O projeto possui estrutura para funcionar como **Progressive Web App (PWA)**.

Isso possibilita recursos como:

- instalação no celular;
- experiência semelhante a aplicativo;
- manifest;
- service worker;
- melhor experiência em dispositivos móveis.

---

## 🛠️ Tecnologias

### Frontend

- HTML5
- CSS3
- JavaScript
- PWA

### Backend / Cloud

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- Deno

### Versionamento

- Git
- GitHub

---

## 📂 Estrutura do projeto

Estrutura simplificada:

```text
desafio-virtual/
│
├── index.html
├── participante.html
├── admin-login.html
├── admin.html
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── participante.css
│   │   ├── admin.css
│   │   └── admin-login.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── participante.js
│   │   ├── admin.js
│   │   └── admin-login.js
│   │
│   └── images/
│
├── manifest.json
├── sw.js
└── README.md
```

> A estrutura pode sofrer alterações conforme a evolução do projeto.

---

## 🔄 Fluxo principal

```text
HOME
 │
 ├── Inscrição
 │      ↓
 │   Supabase
 │
 ├── Pagamento PIX
 │
 └── Área do participante
          ↓
     Enviar atividade
          ↓
       PENDENTE
          ↓
     Painel Admin
       ↙      ↘
 APROVADA   REJEITADA
     ↓
Atualização da
quilometragem
     ↓
Progresso
```

---

## 🚀 Executando localmente

O projeto pode ser executado através de um servidor HTTP local.

Exemplo com VS Code e Live Server:

```text
http://localhost:5500/
```

Evite abrir os arquivos apenas com `file://`, pois funcionalidades relacionadas a módulos, PWA e APIs podem exigir contexto HTTP/HTTPS.

---

## ⚠️ Configuração

Antes de executar o projeto, configure corretamente as informações públicas necessárias para conexão com o Supabase.

Nunca publique:

- Service Role Key;
- Client Secret;
- senhas administrativas;
- tokens OAuth;
- arquivos `.env` contendo secrets.

---

## 🧪 Fluxos testados

Durante o desenvolvimento foram realizados testes de:

- criação de inscrição;
- validação de campos;
- bloqueio de e-mail duplicado;
- armazenamento no Supabase;
- acesso à área do participante;
- envio de atividade;
- upload de comprovante;
- listagem administrativa;
- visualização do comprovante;
- aprovação de atividade;
- atualização do status;
- autenticação administrativa.

---

## 🗺️ Roadmap

Possíveis evoluções:

- [ ] Integração automática com Strava
- [ ] Ranking dinâmico
- [ ] Estatísticas do desafio
- [ ] Dashboard com indicadores adicionais
- [ ] Notificações ao participante
- [ ] Recuperação de acesso
- [ ] Melhorias na auditoria administrativa
- [ ] Relatórios
- [ ] Melhorias adicionais de segurança
- [ ] Automação da confirmação de pagamento

---

## 📌 Status

**MVP em fase de lançamento.**

O fluxo principal de inscrição e registro/validação manual de atividades encontra-se funcional.

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido por **Marcelo Barbosa**.

GitHub:

https://github.com/mbalbuquerque

---

## 📄 Licença

Projeto desenvolvido para gerenciamento do desafio virtual **Corra Por Você**.

O uso, reprodução ou distribuição deve respeitar as condições definidas pelo responsável pelo projeto.