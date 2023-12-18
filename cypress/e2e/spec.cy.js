/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

context('Dev Finances', () => {
  beforeEach(() => {
    cy.visit('https://victorhq.github.io/maratona-discover---RocketSeat/', {
      onBeforeLoad: (win) => {
        prepareLocalStorage(win)
      }
    })
  })
 
  it('Must record entries', () => {
    cy.get('#transaction > .button').click()
    cy.get('#description').type('Salário')
    cy.get('[name=amount]').type(1850)
    cy.get('#date').type('2023-11-07');
    cy.get('button').contains('Salvar').click()

    cy.get('#data-table tbody tr').should('have.length', 3)
  })

  it('Must register exits', () => {
    cy.get('#transaction > .button').click()
    cy.get('#description').type('Imposto Sindical')
    cy.get('[name=amount]').type(-1850 * 1 / 100)
    cy.get('#date').type('2023-12-31');
    cy.get('button').contains('Salvar').click()

    cy.get('#data-table tbody tr').should('have.length', 3)
  })

  it('Remove entries and exits', () => {
    const entrie = 'Mesada';
    const exit = 'Suco';

    // cy.get('#transaction > .button').click()
    // cy.get('#description').type('Salário')
    // cy.get('[name=amount]').type(1850)
    // cy.get('#date').type('2023-11-07');
    // cy.get('button').contains('Salvar').click()

    // cy.get('#transaction > .button').click()
    // cy.get('#description').type('Imposto Sindical')
    // cy.get('[name=amount]').type(-1850 * 1 / 100)
    // cy.get('#date').type('2023-12-31');
    // cy.get('button').contains('Salvar').click()

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

  it('Should validate transactions', () => {
    // const entrie = 'Salário';
    // const exit = 'Imposto';

    // cy.get('#transaction > .button').click()
    // cy.get('#description').type('Salário')
    // cy.get('[name=amount]').type(1850)
    // cy.get('#date').type('2023-11-07');
    // cy.get('button').contains('Salvar').click()

    // cy.get('#transaction > .button').click()
    // cy.get('#description').type('Imposto Sindical')
    // cy.get('[name=amount]').type(-500 * 1 / 100)
    // cy.get('#date').type('2023-12-31');
    // cy.get('button').contains('Salvar').click()

    let incomes = 0
    let expanses = 0

    cy.get('#data-table tbody tr')
      .each(($el, index, $list) => {
        cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
            if(text.includes('-')){
              expanses = expanses + format(text)
            } else {
              incomes = incomes + format(text)
            }

            cy.log(`Entradas: ${incomes}`)
            cy.log(`Saídas: ${expanses}`)
        })
      })

    cy.get('#totalDisplay').invoke('text').then(text => {

      let formattedTotalDisplay = format(text)
      let expectedTotal = incomes + expanses 

      expect(formattedTotalDisplay).to.eq(expectedTotal)
    })
  })
})