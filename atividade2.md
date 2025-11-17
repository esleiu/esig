# Atividade 2 – Fundamentos de Testes  
Automação E2E – QuarkClinic

## 1. Plano de Testes

### O que é um Plano de Testes?
Um Plano de Testes é um documento que descreve a estratégia, o escopo, os objetivos, os recursos e as atividades necessárias para validar a qualidade de um software. Ele garante que todas as funcionalidades críticas sejam testadas e serve como guia para manter o processo organizado, previsível e repetível.

### Importância
- Define o escopo dos testes  
- Alinha expectativas com o time  
- Reduz riscos, falhas ocultas e retrabalho  
- Organiza recursos, prazos e responsabilidades  
- Garante que funcionalidades essenciais funcionem corretamente  

### Seções-chave para o projeto QuarkClinic
1. Introdução e Objetivo  
2. Escopo do Teste  
3. Fora do Escopo  
4. Ambiente de Testes  
5. Requisitos para Teste  
6. Riscos e Dependências  
7. Critérios de Entrada  
8. Critérios de Saída  
9. Métricas  

---

## 2. Tipos de Testes

### Teste de Caixa Preta (Black Box)
O testador não conhece o código-fonte. O foco é validar entradas, saídas e comportamento do sistema.

### Teste de Caixa Branca (White Box)
O testador conhece o código-fonte. O foco é validar fluxos internos, lógica e condições do código.

### Teste de Caixa Cinza (Gray Box)
Mistura caixa preta e branca. O testador conhece parte da estrutura interna, mas testa pela interface.

---

## 3. Casos de Teste

### O que são Casos de Teste?
Casos de teste são documentos que descrevem entradas, passos e resultados esperados para validar uma funcionalidade.

---

## Caso de Teste 1 – Login válido (Positivo)

**Pré-condição:** Usuário existente  
**Passos:**
1. Abrir página inicial  
2. Clicar em “Login”  
3. Informar email válido  
4. Informar senha correta  
5. Aceitar termos  
6. Clicar em “Continuar”

**Resultado Esperado:** Redireciona para home com “Bem-vindo”.

---

## Caso de Teste 2 – Senha incorreta (Negativo)

**Pré-condição:** Usuário existente  
**Passos:**
1. Abrir página inicial  
2. Clicar em “Login”  
3. Informar email válido  
4. Digitar senha errada  
5. Aceitar termos  
6. Clicar em “Continuar”

**Resultado Esperado:** Exibe erro de senha inválida e não redireciona.

---

## Caso de Teste 3 – Email inválido (Borda)

**Pré-condição:** Modal de login aberto  
**Passos:**
1. Digitar email inválido (ex: "teste@")  
2. Digitar senha válida  
3. Aceitar termos  
4. Clicar em “Continuar”

**Resultado Esperado:** Exibe validação de email inválido e não envia requisição.
