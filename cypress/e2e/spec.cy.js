/// <reference types="cypress" />

import dayjs from 'dayjs';

context('Dev Finances', () => {
  beforeEach(() => {
    cy.visit('https://victorhq.github.io/maratona-discover---RocketSeat/')
  })

  it('Must record entries', () => {
    cy.get('#transaction > .button').click()
    cy.get('#description').type('Salário')
    cy.get('[name=amount]').type(1850)
    cy.get('#date').type('2023-11-07');
    cy.get('button').contains('Salvar').click()

    cy.get('#data-table tbody tr').should('have.length', 1)
  })

  it('Must register exits', () => {
    cy.get('#transaction > .button').click()
    cy.get('#description').type('Imposto Sindical')
    cy.get('[name=amount]').type(-1850 * 1 / 100)
    cy.get('#date').type('2023-12-31');
    cy.get('button').contains('Salvar').click()

    cy.get('#data-table tbody tr').should('have.length', 1)
  })

  it.only('Remove entries and exits', () => {
    const entrie = 'Salário';
    const exit = 'Imposto';

    cy.get('#transaction > .button').click()
    cy.get('#description').type('Salário')
    cy.get('[name=amount]').type(1850)
    cy.get('#date').type('2023-11-07');
    cy.get('button').contains('Salvar').click()

    cy.get('#transaction > .button').click()
    cy.get('#description').type('Imposto Sindical')
    cy.get('[name=amount]').type(-1850 * 1 / 100)
    cy.get('#date').type('2023-12-31');
    cy.get('button').contains('Salvar').click()

    cy.get('td.description')
      .contains(entrie)
      .parent()
      .find('img[onclick*=remove]')
      .click()

    cy.get('td.description')
      .contains(exit)
      .siblings()
      .children('img[onclick*=remove]')
      .click()

    cy.get('#data-table tbody tr').should('have.length', 0)
  })
})