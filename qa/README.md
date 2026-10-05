# Garantia da Qualidade de Software — Desafio Virtual

## 1. Identificação do projeto

**Sistema avaliado:** Desafio Virtual — Corra por Você  
**Área:** Eventos esportivos / acompanhamento de atividades  
**Tipo de teste:** Testes automatizados de regras de negócio  
**Linguagem da automação:** Python  
**Ambiente de desenvolvimento:** Visual Studio Code

---

## 2. Objetivo

Este projeto tem como objetivo aplicar conceitos de Garantia da
Qualidade de Software (QA) ao sistema Desafio Virtual — Corra por Você.

A automação verifica regras de negócio importantes do sistema,
registra os resultados dos testes, identifica falhas, calcula métricas
de qualidade e produz automaticamente um relatório HTML.

O processo utilizado é:

Requisito → Teste → Execução → Resultado → Dados →
Identificação de Defeitos → Decisão de QA → Relatório

---

## 3. Sistema avaliado

O Desafio Virtual — Corra por Você permite o cadastro de participantes,
acesso à área do atleta, registro de atividades, acompanhamento de
quilometragem e progresso e classificação dos participantes.

A automação de QA utiliza regras representativas dessas funcionalidades
para verificar se o comportamento esperado está sendo respeitado.

---

## 4. Regras de negócio avaliadas

### RN01 — Validação de e-mail

O sistema deve aceitar apenas e-mails com uma estrutura válida.

### RN02 — E-mail único

Um participante não deve possuir duas inscrições utilizando o mesmo
e-mail.

### RN03 — Controle de acesso

Somente um e-mail previamente cadastrado pode acessar a área do
participante.

### RN04 — Validação da quilometragem

Uma atividade deve possuir quilometragem maior que zero.

Valores negativos ou iguais a zero devem ser rejeitados.

### RN05 — Cálculo de progresso

O percentual de progresso deve ser calculado utilizando:

progresso = (quilometragem percorrida / meta) × 100

Exemplo:

50 km percorridos / 100 km de meta = 50%

### RN06 — Evidência da atividade

Uma atividade deve possuir uma evidência associada ao treino.

### RN07 — Ranking

Os participantes devem ser ordenados pela quilometragem percorrida,
do maior para o menor valor.

---

## 5. Casos de teste

| ID | Requisito | Caso de teste | Resultado esperado | Severidade |
|---|---|---|---|---|
| QA-001 | Inscrição | E-mail válido | Aceitar | Alta |
| QA-002 | Inscrição | E-mail inválido | Rejeitar | Alta |
| QA-003 | Inscrição | E-mail duplicado | Detectar duplicidade | Crítica |
| QA-004 | Área do participante | E-mail cadastrado | Permitir acesso | Crítica |
| QA-005 | Área do participante | E-mail não cadastrado | Bloquear acesso | Crítica |
| QA-006 | Atividades | Quilometragem válida | Aceitar atividade | Alta |
| QA-007 | Atividades | Quilometragem negativa | Rejeitar atividade | Crítica |
| QA-008 | Progresso | Calcular percentual | Retornar 50% | Crítica |
| QA-009 | Atividades | Atividade com evidência | Aceitar | Alta |
| QA-010 | Ranking | Ordenação por km | Maior km em primeiro | Média |

Total: **10 casos de teste automatizados**.

---

## 6. Classificação dos resultados

Cada teste pode apresentar um dos seguintes estados:

### PASS

A funcionalidade apresentou o comportamento esperado.

### FAIL

O resultado obtido foi diferente do resultado esperado.

---

## 7. Severidade

As falhas são classificadas conforme seu impacto.

### Média

Problema com impacto limitado e que não impede as funcionalidades
principais do sistema.

### Alta

Problema importante que afeta uma funcionalidade relevante.

### Crítica

Problema que compromete uma regra essencial do sistema e impede a
liberação da versão.

---

## 8. Métricas de qualidade

Após a execução, a automação calcula:

- total de testes executados;
- quantidade de testes aprovados;
- quantidade de testes com falha;
- taxa de aprovação;
- quantidade de falhas críticas.

A taxa de aprovação é calculada utilizando:

Taxa de aprovação = (testes aprovados / total de testes) × 100

---

## 9. Critério de decisão de QA

A automação utiliza os seguintes critérios:

### LIBERADO

Todos os testes foram aprovados.

### LIBERADO COM RESSALVAS

Existe uma ou mais falhas, porém nenhuma delas possui severidade
crítica.

### NÃO LIBERAR

Existe pelo menos uma falha classificada como crítica.

---

## 10. Execução normal

No terminal do VS Code, acessar a pasta:

```powershell
cd qa
```

Executar:

```powershell
python main.py
```

Resultado esperado:

```text
Total de testes: 10
Aprovados: 10
Falharam: 0
Taxa de aprovação: 100.0%
Falhas críticas: 0

DECISÃO FINAL DE QA: LIBERADO
```

O relatório correspondente será salvo em:

```text
relatorios/relatorio_qa_normal.html
```

---

## 11. Demonstração do bug proposital

Para demonstrar a capacidade da automação de detectar defeitos,
foi implementado um modo de simulação.

Executar:

```powershell
python main.py --bug
```

Nesse modo é introduzido propositalmente um defeito na regra de
cálculo do progresso.

### Regra correta

```text
(50 / 100) × 100 = 50%
```

### Regra defeituosa

```text
(50 / 100) × 50 = 25%
```

O teste QA-008 espera:

```text
50%
```

mas recebe:

```text
25%
```

Portanto:

```text
QA-008 | FAIL
Esperado: 50.0
Obtido: 25.0
Severidade: CRÍTICA
```

---

## 12. Resultado com bug

Resultado esperado:

```text
Total de testes: 10
Aprovados: 9
Falharam: 1
Taxa de aprovação: 90.0%
Falhas críticas: 1

DECISÃO FINAL DE QA: NÃO LIBERAR
```

O relatório será salvo em:

```text
relatorios/relatorio_qa_bug.html
```

---

## 13. Comparação

| Indicador | Versão normal | Versão com bug |
|---|---:|---:|
| Testes | 10 | 10 |
| PASS | 10 | 9 |
| FAIL | 0 | 1 |
| Aprovação | 100% | 90% |
| Falhas críticas | 0 | 1 |
| Decisão | LIBERADO | NÃO LIBERAR |

A comparação demonstra que a automação foi capaz de detectar uma
regressão introduzida propositalmente no sistema.

---

## 14. Estrutura

```text
qa/
│
├── main.py
├── regras.py
├── casos_teste.py
├── gerador_relatorio.py
├── README.md
│
└── relatorios/
    ├── relatorio_qa_normal.html
    └── relatorio_qa_bug.html
```

### main.py

Responsável pela execução da automação, cálculo das métricas e decisão
final de QA.

### regras.py

Contém as regras de negócio utilizadas pelos testes.

### casos_teste.py

Contém os casos de teste e compara os resultados esperados com os
resultados obtidos.

### gerador_relatorio.py

Responsável pela geração automática dos relatórios HTML.

---

## 15. Conclusão

A automação permite verificar regras importantes do Desafio Virtual,
identificar comportamentos incorretos e impedir a liberação de uma
versão quando uma falha crítica é encontrada.

A demonstração do bug proposital evidencia a importância dos testes
automatizados para identificar regressões antes da liberação de uma
nova versão do software.