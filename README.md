# QuarkClinic – Automação de Testes E2E com Cypress

Este repositório contém a automação E2E da jornada de agendamento online da QuarkClinic, desenvolvida como parte da atividade prática do processo seletivo para a vaga de QA – Automação.

A automação cobre:

1. Cadastro de novo usuário  
2. Login de usuário existente  
3. Agendamento de consulta presencial  
4. Envio de comprovante de pagamento por transferência bancária

---

## Descrição Geral

O objetivo do projeto é validar, de ponta a ponta, o fluxo real de um paciente no portal de agendamento, desde a criação da conta até a finalização do pagamento, utilizando Cypress.

Foram utilizados:

- Interações com a interface  
- Validações de URL e textos  
- Interceptação de requisições HTTP com `cy.intercept`  
- Upload de arquivo com `cy.selectFile`  
- Sincronização com backend usando `cy.wait`  

---

## Tecnologias Utilizadas

- Cypress  
- JavaScript  
- Node.js  
- NPM  

---

## Estrutura do Projeto

```
qa-esig/
  cypress/
    e2e/
      testes.cy.js
    fixtures/
      Notas-fiscais.jpg
    support/
      commands.js
      e2e.js
  cypress.config.js
  package.json
  README.md
```

---

## Fluxos Automatizados

### Fluxo 1 – Cadastro de Novo Usuário
- Acessa a home  
- Abre o modal de cadastro  
- Preenche dados pessoais  
- Preenche documento  
- Preenche senha e confirmação  
- Marca aceite dos termos  
- Envia a requisição  
- Valida código de resposta e mensagem de boas-vindas  

### Fluxo 2 – Login
- Abre o modal de login  
- Preenche e-mail e senha  
- Marca aceite das políticas  
- Envia o formulário  
- Aguarda resposta da API com sucesso  
- Valida entrada na área logada  

### Fluxo 3 – Agendamento de Consulta
- Clica em “Consulta presencial”  
- Seleciona convênio  
- Seleciona especialidade  
- Seleciona clínica  
- Seleciona horário disponível  
- Seleciona o paciente  
- Valida dados na tela de confirmação  
- Confirma o agendamento  

### Fluxo 4 – Envio de Comprovante
- Acessa a tela de pagamento  
- Seleciona arquivo de comprovante  
- Preenche observação  
- Envia o comprovante  
- Valida mensagem de sucesso  

---

## Como instalar

```
npm install
```

---

## Como executar os testes

Modo interativo:

```
npx cypress open
```

Modo headless:

```
npx cypress run
```

---

## Arquivo principal

```
cypress/e2e/testes.cy.js
```

---

## Autor

Wesley Costa
