# QuarkClinic – Automação de Testes E2E com Cypress

Este repositório contém a automação E2E do fluxo completo de agendamento da plataforma QuarkClinic, desenvolvida como parte da atividade prática do processo seletivo para a vaga de QA – Automação.

Os testes cobrem:

1. Cadastro de novo usuário  
2. Login de usuário existente  
3. Agendamento de consulta presencial  
4. Envio de comprovante de pagamento

---

## Descrição Geral

O projeto valida, de ponta a ponta, o fluxo real de um paciente dentro do sistema:

- criação de conta  
- autenticação  
- seleção do tipo de consulta  
- escolha de convênio, especialidade, clínica e horário  
- envio de comprovante de pagamento  

Os testes utilizam boas práticas essenciais, como:

- seletor data-cy  
- interceptação de requisições  
- waits baseados em API  
- upload de arquivo  
- validações de URL e mensagens  

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

# Explicações Importantes dos Fluxos

## Funcionamento da seleção automática (especialidade e clínica)

Ao selecionar o convênio “PARTICULAR”, o sistema realiza automaticamente:

1. busca das especialidades  
2. navegação para clínica  


Isso acontece porque a API retorna apenas uma opção disponível no momento, e o sistema avança sozinho para a próxima etapa.

O teste valida apenas a navegação:

```
cy.url().should("include", "/especialidade")
cy.url().should("include", "/clinica")
```

---

## Como o teste seleciona horário disponível

Os horários mudam constantemente, então o teste usa:

```
cy.get('[data-cy^="agenda-item-horario-"]:visible', { timeout: 15000 })
  .first()
  .click({ force: true })
```

Isso garante que:

- sempre haverá um horário selecionável  
- o teste não depende de datas fixas  
- a execução acompanha a agenda real da clínica  

---

## Fluxos Automatizados

### Fluxo 1 – Cadastro de Novo Usuário
- abre modal  
- preenche os campos  
- cria conta  
- valida área logada  

### Fluxo 2 – Login
- abre modal  
- preenche email e senha  
- intercepta e valida login  

### Fluxo 3 – Agendamento de Consulta
- seleciona convênio  
- sistema avança sozinho para especialidade e clínica  
- seleciona primeiro horário disponível  
- seleciona paciente  
- confirma dados  
- envia agendamento  

### Fluxo 4 – Envio de Comprovante
- acessa tela de pagamento  
- faz upload  
- insere observação  
- envia formulário  
- valida mensagem  

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
