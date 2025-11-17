/// <reference types="cypress" />

const urlBase = "https://agendamento.quarkclinic.com.br/index/363622206";


const EMAIL_VALIDO = "wesley34201@teste.com";
const SENHA_VALIDA = "Senha123!";

describe("QuarkClinic - Fluxos 1, 2, 3 e 4", () => {
  it("Fluxo 1 - Cadastro de novo usuário", () => {
    cy.visit(urlBase);

    cy.contains("button", "Cadastre-se").click({ force: true });

    cy.get(".modal.show").should("be.visible").within(() => {
      const aleatorio = Math.floor(Math.random() * 99999);
      const email = `wesley${aleatorio}@teste.com`;


      cy.get('input[placeholder="Nome do paciente"]:visible')
        .clear()
        .type("Wesley Costa");

      cy.get('input[placeholder="(00) 00000-0000"]:visible')
        .clear()
        .type("11999999999");


      cy.get("select:visible").first().select("MASCULINO");

      cy.get('input[placeholder="dd/mm/aaaa"]:visible')
        .clear()
        .type("12092000");

      cy.get('input[placeholder="Email"]:visible').clear().type(email);

      cy.get("#tipodocumento").select("CPF");

      cy.get('[data-cy="col-numero-documento"] input', { timeout: 6000 })
        .should("be.visible")
        .clear()
        .type("12345678909");

      cy.get('input[type="password"]').eq(0).type("Senha123!");

      cy.get('input[type="password"]').eq(1).type("Senha123!");

      cy.get('input[type="checkbox"]').last().check({ force: true });

      cy.intercept("POST", "**/api/social/usuarios").as("cadastro");

      cy.get('[data-cy="btn-criar-conta"]')
        .should("be.visible")
        .click({ force: true });
    });


    cy.wait("@cadastro")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    cy.contains("Bem-vindo", { matchCase: false }).should("exist");
  });

  it("Fluxo 2 - Login de usuário existente", () => {
    cy.visit(urlBase);

    cy.get('[data-cy="btn-login"]').click({ force: true });


    cy.get(".modal.show")
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="campo-usuario-input"]')
          .should("be.visible")
          .clear()
          .type(EMAIL_VALIDO);

        cy.get('[data-cy="campo-senha-input"]')
          .should("be.visible")
          .clear()
          .type(SENHA_VALIDA);


        cy.intercept("POST", "**/login").as("login");

        cy.get('[data-cy="checkbox-aceita-politicas"]').click();

        cy.get('[data-cy="btn-submit-login"]')
          .should("be.visible")
          .click();
      });

    cy.wait("@login").its("response.statusCode").should("eq", 200);

    cy.contains("Bem-vindo", { matchCase: false }).should("exist");
  });

  it("Fluxo 3 + 4 - Agendar consulta presencial e enviar comprovante de pagamento", () => {
    cy.visit(urlBase);

    cy.get('[data-cy="btn-login"]').click({ force: true });

    cy.get(".modal.show")
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="campo-usuario-input"]')
          .should("be.visible")
          .clear()
          .type(EMAIL_VALIDO);

        cy.get('[data-cy="campo-senha-input"]')
          .should("be.visible")
          .clear()
          .type(SENHA_VALIDA);

        cy.intercept("POST", "**/login").as("login");

        cy.get('[data-cy="checkbox-aceita-politicas"]').click();

        cy.get('[data-cy="btn-submit-login"]')
          .should("be.visible")
          .click();
      });

    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.contains("Bem-vindo", { matchCase: false }).should("exist");

    cy.intercept("GET", "**/api/agendamentos/agendas**").as("getAgendas");

    cy.get('[data-cy="btn-consulta-presencial"]')
      .should("be.visible")
      .click();


    cy.url().should("include", "/consulta/363622206/convenio");

    cy.contains("label.custom-control-label", "PARTICULAR")
      .should("be.visible")
      .click({ force: true });

    cy.url().should("include", "/consulta/363622206/especialidade");
    cy.url().should("include", "/consulta/363622206/clinica");
    cy.url().should("include", "/consulta/363622206/agendar");

    cy.wait("@getAgendas");

    cy.get('[data-cy^="agenda-item-horario-"]:visible', { timeout: 15000 })
      .first()
      .click({ force: true });

    cy.url().should("include", "/consulta/363622206/paciente");

    cy.get('[data-cy="paciente-card-radio"]', { timeout: 10000 })
      .should("have.length.greaterThan", 0)
      .first()
      .click({ force: true });


    cy.get('[data-cy="confirmacao-table"]', { timeout: 10000 })
      .should("be.visible");

    cy.get('[data-cy="confirmacao-row-especialidade"]')
      .should("contain.text", "CARDIOLOGIA");

    cy.get('[data-cy="confirmacao-row-convenio"]')
      .should("contain.text", "PARTICULAR");

    cy.get('[data-cy="confirmacao-row-paciente"]')
      .should("contain.text", "Paciente");

    cy.intercept("POST", "**/agendamentos").as("postAgendamento");

    cy.get('[data-cy="confirmacao-btn-confirmar"]')
      .should("be.visible")
      .click({ force: true });

    cy.wait("@postAgendamento")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    cy.contains("Agendamento efetuado com sucesso!", {
      matchCase: false,
      timeout: 10000,
    }).should("be.visible");

    cy.get('[data-cy="finalizacao-btn-transferencia"]')
      .should("be.visible")
      .click({ force: true });

    cy.url().should("include", "/pagamento/363622206");

    cy.get("#comprovante", { timeout: 10000 })
      .should("exist") 
      .selectFile("cypress/fixtures/Notas-fiscais.jpg", { force: true });

    cy.get('[data-cy="pagamento-form-group-observacao"] textarea', {
      timeout: 10000,
    })
      .should("be.visible")
      .type("Comprovante de teste — enviado automaticamente pelo Cypress");

    cy.intercept("POST", "**/pagamento/**").as("envioComprovante");

    cy.get('[data-cy="pagamento-form-btn-enviar"]')
      .should("be.visible")
      .click({ force: true });

    cy.wait("@envioComprovante")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    cy.contains("Obrigado por enviar! Iremos analisar!", {
      matchCase: false,
      timeout: 10000,
    }).should("be.visible");


    cy.url().should("include", "/index/");
  });
});
