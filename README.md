# 🏃 Corra Por Você — Desafio Virtual

Plataforma web para gerenciamento de desafios virtuais de corrida, com inscrições, acompanhamento de desempenho, registro de atividades, ranking e administração do evento.

O sistema permite que atletas acompanhem sua evolução durante o desafio, consultem suas atividades e comparem o desempenho real com a meta estabelecida.

## 1. Sobre o projeto

O **Corra Por Você — Desafio Virtual** foi desenvolvido para oferecer uma experiência digital simples e acessível aos participantes de desafios esportivos.

A plataforma reúne funcionalidades de inscrição, acompanhamento individual, registro de atividades e gestão administrativa em uma interface responsiva.

O projeto utiliza HTML, CSS e JavaScript no frontend, Supabase como serviço de banco de dados e Netlify para hospedagem.

## 2. Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade e regras do frontend |
| Supabase | Banco PostgreSQL e APIs |
| Chart.js | Gráficos dinâmicos de desempenho |
| Netlify | Hospedagem e publicação |
| Git e GitHub | Versionamento do projeto |

## 3. Funcionalidades

### Landing page

- Apresentação do desafio.
- Informações sobre participação.
- Formulário de inscrição.
- Contador de inscritos.
- Acesso à área do participante.
- Ranking público.

### Inscrição de atletas

- Cadastro de nome, e-mail e modalidade.
- Equipe opcional.
- Validação de duplicidade por e-mail.
- Armazenamento das inscrições no Supabase.

### Área do participante

O participante acessa sua área informando o e-mail cadastrado.

O painel apresenta:

- Nome e modalidade do atleta.
- Meta total de quilômetros.
- Quilometragem acumulada.
- Percentual concluído.
- Quilômetros restantes.
- Dias restantes do desafio.
- Posição no ranking.
- Indicadores de ritmo.
- Histórico de atividades.
- Gráficos de desempenho.
- Dicas de treino, hidratação e alimentação.
- Compartilhamento de resultados.

### Registro de atividades

Os atletas podem registrar seus treinos informando:

- Data da atividade.
- Distância percorrida.
- Tempo.
- Imagem do comprovante.

As atividades são encaminhadas para validação administrativa.

**Status utilizados:**

- `PENDENTE` — aguardando análise.
- `APROVADA` — atividade validada.
- `REJEITADA` — atividade não aceita, quando aplicável.

Somente atividades aprovadas devem contribuir para o desempenho oficial.

### Histórico de atividades

A seção **Minhas Atividades** apresenta:

| Informação | Descrição |
|---|---|
| Data | Dia do treino |
| Distância | Quilometragem registrada |
| Tempo | Duração informada |
| Status | Situação da validação |

A consulta utiliza a view `atividades_publicas`, criada no Supabase.

### Gráficos dinâmicos

A plataforma utiliza **Chart.js** para apresentar a evolução esportiva dos participantes.

**Gráfico Real × Esperado**

Compara duas curvas:

- Real: quilômetros acumulados em atividades aprovadas.
- Esperado: evolução proporcional necessária para atingir a meta no período do desafio.

**Gráfico circular de progresso**

Apresenta a quilometragem aprovada em relação à meta da modalidade.

Os gráficos utilizam os dados disponíveis no Supabase e são atualizados quando a página consulta novamente os registros.

### Ranking

O ranking permite acompanhar a classificação dos participantes de acordo com a quilometragem acumulada.

A plataforma utiliza a view `ranking_publico` para disponibilizar os dados de classificação.

### Área administrativa

A administração do evento contempla funcionalidades de acompanhamento e gerenciamento de inscrições e atividades.

Entre as operações previstas no fluxo estão:

- Consultar participantes.
- Acompanhar inscrições.
- Analisar comprovantes.
- Aprovar ou rejeitar atividades.
- Acompanhar a evolução dos atletas.
- Consultar informações de gestão do desafio.

## 4. Regras de negócio

1. Cada participante deve possuir uma inscrição identificável no banco de dados.
2. O e-mail é utilizado no fluxo atual de acesso à área do participante.
3. Cada modalidade possui uma meta de quilômetros.
4. Atividades pendentes não devem aumentar o desempenho oficial.
5. A quilometragem aprovada deve ser considerada no acompanhamento do desafio.
6. O ranking deve refletir os critérios de classificação definidos pela organização.
7. O desempenho esperado é calculado proporcionalmente ao período oficial do desafio.
8. A interface deve funcionar em smartphones e computadores.

## 5. Estrutura do projeto

Estrutura simplificada dos principais arquivos:

```text
desafio-virtual/
├── index.html
├── acesso.html
├── participante.html
├── admin-login.html
├── admin.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── participante.css
│   ├── js/
│   │   ├── supabase.js
│   │   ├── participante.js
│   │   └── graficos.js
│   └── images/
└── README.md
```

Outros arquivos podem existir conforme a organização atual do repositório.

## 6. Arquitetura

```text
             PARTICIPANTE
                  |
                  v
          FRONTEND WEB
       HTML + CSS + JavaScript
                  |
                  v
          SUPABASE CLIENT
                  |
                  v
        SUPABASE / POSTGRESQL
                  |
          +-------+-------+
          |               |
          v               v
      INSCRIÇÕES       ATIVIDADES
          |               |
          +-------+-------+
                  |
                  v
          VIEWS DE CONSULTA
       ranking_publico
       atividades_publicas
                  |
                  v
       DASHBOARD E GRÁFICOS
```

A publicação do frontend é realizada pelo Netlify.

## 7. Banco de dados

### Tabela `inscricoes`

Armazena informações dos participantes, incluindo identificação, modalidade e quilometragem acumulada.

### Tabela `atividades`

Armazena os registros de treinos, com informações como:

- `id`
- `inscricao_id`
- `data_atividade`
- `distancia_km`
- `tempo`
- `comprovante_url`
- `status`
- `observacao_admin`
- `criado_em`
- `validado_em`
- `validado_por`

### Views

**`ranking_publico`**

Disponibiliza informações utilizadas no ranking.

**`atividades_publicas`**

Disponibiliza informações limitadas das atividades, como nome, modalidade, data, distância, tempo e status.

## 8. Segurança e privacidade

O Supabase utiliza políticas de acesso por meio de Row Level Security (RLS).

A plataforma deve preservar dados pessoais, comprovantes e informações administrativas contra consultas não autorizadas.

**Pontos de atenção da implementação atual:**

- O acesso apenas pelo e-mail não comprova a identidade do participante.
- A view `atividades_publicas` permite consulta pública aos campos disponibilizados.
- A identificação por nome e modalidade pode gerar conflitos entre participantes homônimos.
- Recomenda-se adotar identificadores públicos únicos e revisar as políticas de acesso antes de ampliar a exposição de dados.

Chaves administrativas e credenciais privilegiadas não devem ser incluídas no código público.

## 9. Executar localmente

Clone o repositório:

```bash
git clone https://github.com/mbalbuquerque/desafio-virtual.git
```

Entre na pasta:

```bash
cd desafio-virtual
```

Utilize um servidor local, como a extensão Live Server do VS Code.

Verifique se as configurações públicas do cliente Supabase estão corretamente definidas.

Não publique chaves `service_role` ou outras credenciais administrativas no frontend.

## 10. Testes recomendados

### Participante

- [ ] Inscrição de novo atleta.
- [ ] Validação de e-mail duplicado.
- [ ] Acesso à área do participante.
- [ ] Carregamento dos indicadores.
- [ ] Consulta do histórico de atividades.
- [ ] Registro de novo treino.
- [ ] Exibição de atividades pendentes.
- [ ] Atualização após aprovação.
- [ ] Funcionamento dos gráficos.
- [ ] Comparação entre quilômetros reais e esperados.
- [ ] Responsividade em smartphone.

### Administração

- [ ] Acesso administrativo.
- [ ] Consulta de participantes.
- [ ] Análise de comprovantes.
- [ ] Aprovação de atividades.
- [ ] Rejeição de atividades.
- [ ] Atualização dos indicadores.
- [ ] Consistência entre ranking, dashboard e gráficos.

### Segurança

- [ ] Revisar políticas RLS.
- [ ] Verificar permissões das views públicas.
- [ ] Impedir acesso público aos comprovantes privados.
- [ ] Testar participantes com nomes iguais.
- [ ] Verificar ausência de credenciais privilegiadas no repositório.

## 11. Publicação

**Plataforma:** Netlify

**Site:** https://corraporvocedesafiovirtual.netlify.app/

**Repositório:** https://github.com/mbalbuquerque/desafio-virtual

Para enviar alterações:

```bash
git add .
git commit -m "docs: atualiza README com dashboard e graficos dinamicos"
git push origin main
```

## 12. Melhorias futuras

- Identificador público único por participante.
- Revisão de segurança do acesso individual.
- Gráfico de desempenho semanal.
- Filtros por período nos gráficos.
- Exportação de relatórios.
- Indicadores administrativos avançados.
- Otimizações adicionais para dispositivos móveis.
- Melhorias de acessibilidade.

## 13. Status do projeto

**Versão funcional em evolução.**

Funcionalidades implementadas e visualizadas durante o desenvolvimento:

- Inscrições e acesso do participante.
- Dashboard de acompanhamento.
- Histórico de atividades.
- Ranking público.
- Gráfico de evolução real × esperado.
- Gráfico circular de progresso.

A conclusão definitiva depende da validação integrada dos dados, dos testes de segurança e do QA final.

---

**Corra Por Você — Desafio Virtual**

*Cada quilômetro conta. Cada conquista começa com você.*