/// <reference types="cypress" />

// url base usada em todos os fluxos
const urlBase = "https://agendamento.quarkclinic.com.br/index/363622206";

// credenciais usadas para login
const EMAIL_VALIDO = "wesley34201@teste.com";
const SENHA_VALIDA = "Senha123!";

// suite de testes cobrindo cadastro, login, agendamento e pagamento
describe("QuarkClinic - Fluxos 1, 2, 3 e 4", () => {

  // fluxo 1 cadastro de novo usuário
  it("Fluxo 1 - Cadastro de novo usuário", () => {

    cy.visit(urlBase); // acessa a página inicial

    cy.contains("button", "Cadastre-se").click({ force: true }); // abre modal de cadastro

    cy.get(".modal.show").should("be.visible").within(() => {

      // gera email aleatório a cada execução
      const aleatorio = Math.floor(Math.random() * 99999);
      const email = `wesley${aleatorio}@teste.com`;

      // preenche nome
      cy.get('input[placeholder="Nome do paciente"]:visible')
        .clear()
        .type("Wesley Costa");

      // preenche telefone
      cy.get('input[placeholder="(00) 00000-0000"]:visible')
        .clear()
        .type("11999999999");

      // seleciona sexo
      cy.get("select:visible").first().select("MASCULINO");

      // data de nascimento
      cy.get('input[placeholder="dd/mm/aaaa"]:visible')
        .clear()
        .type("12092000");

      // email
      cy.get('input[placeholder="Email"]:visible').clear().type(email);

      // tipo documento
      cy.get("#tipodocumento").select("CPF");

      // preenche número do documento após o campo carregar
      cy.get('[data-cy="col-numero-documento"] input', { timeout: 6000 })
        .should("be.visible")
        .clear()
        .type("12345678909");

      // senha e confirmação
      cy.get('input[type="password"]').eq(0).type("Senha123!");
      cy.get('input[type="password"]').eq(1).type("Senha123!");

      // aceita termos
      cy.get('input[type="checkbox"]').last().check({ force: true });

      // intercepta cadastro
      cy.intercept("POST", "**/api/social/usuarios").as("cadastro");

      // envia cadastro
      cy.get('[data-cy="btn-criar-conta"]')
        .should("be.visible")
        .click({ force: true });
    });

    // valida resposta da api
    cy.wait("@cadastro")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    // confirma que entrou na área logada
    cy.contains("Bem-vindo", { matchCase: false }).should("exist");
  });

  // fluxo 2 login de usuário existente
  it("Fluxo 2 - Login de usuário existente", () => {

    cy.visit(urlBase); // abre página

    cy.get('[data-cy="btn-login"]').click({ force: true }); // abre modal

    cy.get(".modal.show")
      .should("be.visible")
      .within(() => {

        // email
        cy.get('[data-cy="campo-usuario-input"]')
          .should("be.visible")
          .clear()
          .type(EMAIL_VALIDO);

        // senha
        cy.get('[data-cy="campo-senha-input"]')
          .should("be.visible")
          .clear()
          .type(SENHA_VALIDA);

        // intercepta login
        cy.intercept("POST", "**/login").as("login");

        // aceita termos
        cy.get('[data-cy="checkbox-aceita-politicas"]').click();

        // envia login
        cy.get('[data-cy="btn-submit-login"]')
          .should("be.visible")
          .click();
      });

    // aguarda resposta da api
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    // confirma área logada
    cy.contains("Bem-vindo", { matchCase: false }).should("exist");
  });

  // fluxo 3 e 4 agendamento + comprovante
  it("Fluxo 3 + 4 - Agendar consulta presencial e enviar comprovante de pagamento", () => {

    cy.visit(urlBase); // abre home

    cy.get('[data-cy="btn-login"]').click({ force: true }); // abre login

    cy.get(".modal.show")
      .should("be.visible")
      .within(() => {

        // email
        cy.get('[data-cy="campo-usuario-input"]')
          .should("be.visible")
          .clear()
          .type(EMAIL_VALIDO);

        // senha
        cy.get('[data-cy="campo-senha-input"]')
          .should("be.visible")
          .clear()
          .type(SENHA_VALIDA);

        // intercepta login
        cy.intercept("POST", "**/login").as("login");

        // aceita termos
        cy.get('[data-cy="checkbox-aceita-politicas"]').click();

        // envia login
        cy.get('[data-cy="btn-submit-login"]')
          .should("be.visible")
          .click();
      });

    // valida login
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.contains("Bem-vindo", { matchCase: false }).should("exist");

    // intercepta agendas (carregamento dinâmico)
    cy.intercept("GET", "**/api/agendamentos/agendas**").as("getAgendas");

    // abre consulta presencial
    cy.get('[data-cy="btn-consulta-presencial"]')
      .should("be.visible")
      .click();

    cy.url().should("include", "/consulta/363622206/convenio");

    // seleciona convênio particular
    cy.contains("label.custom-control-label", "PARTICULAR")
      .should("be.visible")
      .click({ force: true });

    // garante navegação por especialidade, clínica e agenda
    cy.url().should("include", "/consulta/363622206/especialidade");
    cy.url().should("include", "/consulta/363622206/clinica");
    cy.url().should("include", "/consulta/363622206/agendar");

    // espera agendas carregarem
    cy.wait("@getAgendas");

    // seleciona o primeiro horário disponível
    cy.get('[data-cy^="agenda-item-horario-"]:visible', { timeout: 15000 })
      .first()
      .click({ force: true });

    cy.url().should("include", "/consulta/363622206/paciente");

    // seleciona o paciente
    cy.get('[data-cy="paciente-card-radio"]', { timeout: 10000 })
      .should("have.length.greaterThan", 0)
      .first()
      .click({ force: true });

    // tabela de confirmação
    cy.get('[data-cy="confirmacao-table"]', { timeout: 10000 })
      .should("be.visible");

    // valida dados exibidos
    cy.get('[data-cy="confirmacao-row-especialidade"]').should("contain.text", "CARDIOLOGIA");
    cy.get('[data-cy="confirmacao-row-convenio"]').should("contain.text", "PARTICULAR");
    cy.get('[data-cy="confirmacao-row-paciente"]').should("contain.text", "Paciente");

    // intercepta criação de agendamento
    cy.intercept("POST", "**/agendamentos").as("postAgendamento");

    // confirma agendamento
    cy.get('[data-cy="confirmacao-btn-confirmar"]')
      .should("be.visible")
      .click({ force: true });

    // valida resposta da api
    cy.wait("@postAgendamento")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    // mensagem de sucesso
    cy.contains("Agendamento efetuado com sucesso!", {
      matchCase: false,
      timeout: 10000,
    }).should("be.visible");

    // abre tela de pagamento
    cy.get('[data-cy="finalizacao-btn-transferencia"]')
      .should("be.visible")
      .click({ force: true });

    cy.url().should("include", "/pagamento/363622206");

    // upload do comprovante
    cy.get("#comprovante", { timeout: 10000 })
      .should("exist")
      .selectFile("cypress/fixtures/Notas-fiscais.jpg", { force: true });

    // observação do comprovante
    cy.get('[data-cy="pagamento-form-group-observacao"] textarea', {
      timeout: 10000,
    })
      .should("be.visible")
      .type("Comprovante de teste — enviado automaticamente pelo Cypress");

    // intercepta envio do comprovante
    cy.intercept("POST", "**/pagamento/**").as("envioComprovante");

    // envia comprovante
    cy.get('[data-cy="pagamento-form-btn-enviar"]')
      .should("be.visible")
      .click({ force: true });

    // valida resposta do backend
    cy.wait("@envioComprovante")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    // mensagem de sucesso
    cy.contains("Obrigado por enviar! Iremos analisar!", {
      matchCase: false,
      timeout: 10000,
    }).should("be.visible");

    // redireciona de volta para a home
    cy.url().should("include", "/index/");
  });
});
