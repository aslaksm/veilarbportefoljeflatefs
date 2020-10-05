import React from "react";

const gruppenavn = "Voffvoff";
const gruppenavnRedigert = "Mjaumjau";
const andersen = "Andersen";
const jonas = "Jonas";
const aasen = "Aasen"
const minstEnVeileder = "Du må legge til veiledere."

describe('Lag ny veiledergruppe', () => {
    it('Start server', () => {
        cy.configure();
    })
    it('Gå til enhetens oversikt', () => {
        cy.gaTilOversikt("enhetens-oversikt")
    })
    it('Gå til Veiledergrupper tab', () => {
        cy.klikkTab("VEILEDERGRUPPER");
    })
    it('Det eksisterer 5 veiledergrupper', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper').should('have.length', 5)
    })
    it('Klikk på ny gruppe', () => {
        cy.getByTestId('veiledergruppe_ny-gruppe_knapp').click()
    })
    it('Skriv inn gruppenavn', () => {
        cy.getByTestId('veiledergruppe_modal_gruppenavn-input').type(gruppenavn)
    })
    it('Søk veileder', () => {
        cy.getByTestId('veiledergruppe_modal_sok-veileder-input').type(andersen)
    })
    it('Velg søkt veileder', () => {
        cy.getByTestId('veiledergruppe_modal_veileder-checkbox_0').check({force: true})
    })
    it('Søk en veileder til', () => {
        cy.getByTestId('veiledergruppe_modal_sok-veileder-input').clear().type(jonas)
    })
    it('Velg søkt veileder', () => {
        cy.getByTestId('veiledergruppe_modal_veileder-checkbox_0').check({force: true})
    })
    it('Klikk lagre', () => {
        cy.getByTestId('veiledergruppe_modal_lagre-knapp').click()
    })
    it('Toasten skal vise "Gruppen er opprettet"', () => {
        cy.getByTestId('timed-toast').contains("Gruppen er opprettet")
    })
    it('Etikettene skal inneholde Andersen og Jonas', () => {
        cy.getByTestId('filtreringlabel').contains(andersen)
        cy.getByTestId('filtreringlabel').contains(jonas)
    })
    it('Det eksisterer 6 veiledergrupper', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper').should('have.length', 6)
    })
    it('Ny gruppe skal være valgt', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper')
            .contains(gruppenavn)
        cy.getByTestId(`veiledergruppe-rad_${gruppenavn}`)
            .should('be.checked')
    })
})

describe('Rediger filternavn', () => {
    it('Klikk på blyantsymbolet', () => {
        cy.getByTestId(`rediger-veiledergruppe_knapp_${gruppenavn}`).click()
    })
    it('Skriv inn nytt gruppenavn', () => {
        cy.getByTestId('veiledergruppe_modal_gruppenavn-input').clear().type(gruppenavnRedigert)
    })
    it('Klikk lagre', () => {
        cy.getByTestId('veiledergruppe_modal_lagre-knapp').click()
    })
    it('Toasten skal vise "Gruppen er lagret"', () => {
        cy.getByTestId('timed-toast').contains("Gruppen er lagret")
    })
    it('Sjekk at filternavn er oppdatert', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper')
            .contains(gruppenavnRedigert)
    })
    it('Det eksisterer 6 veiledergrupper', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper').should('have.length', 6)
    })
})

describe('Rediger filtervalg', () => {
    it('Klikk på blyantsymbolet', () => {
        cy.getByTestId(`rediger-veiledergruppe_knapp_${gruppenavnRedigert}`).click()
    })
    it('Fjern veiledere', () => {
        cy.getByTestId('veiledergruppe_modal_valgt-veileder_fjern-knapp').first().click()
        cy.getByTestId('veiledergruppe_modal_valgt-veileder_fjern-knapp').first().click()
    })
    it('Antall veiledere skal være 0, og det skal stå "Ingen veiledere lagt til i gruppen"', () => {
        cy.getByTestId('veiledergruppe_modal_antall-valgte-veiledere_0').should('exist')
        cy.getByTestId('veiledergruppe_modal_valgte-veiledere_wrapper')
            .contains("Ingen veiledere lagt til i gruppen")
    })
    it('Klikk lagre endringer', () => {
        cy.getByTestId('veiledergruppe_modal_lagre-knapp').contains("Lagre endringer").click()
    })
    it('Feilmelding sier at du må legge til veiledere', () => {
        cy.getByTestId('veiledergruppe_modal_form').contains(minstEnVeileder)
    })
    it('Velg veileder', () => {
        cy.getByTestId('veiledergruppe_modal_veileder-checkbox_0').check({force: true})
    })
    it('Klikk lagre endringer', () => {
        cy.getByTestId('veiledergruppe_modal_lagre-knapp').contains("Lagre endringer").click()
    })
    it('Det eksisterer 6 veiledergrupper', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper').should('have.length', 6)
    })
    it('Toasten skal vise "Gruppen er lagret"', () => {
        cy.getByTestId('timed-toast').should("be.visible").contains("Gruppen er lagret")
    })
    it('Sjekk at det er ett filtervalg', () => {
        cy.getByTestId('filtreringlabel').should('have.length', 1).contains(aasen)
    })
})

describe('Slett veiledergruppe', () => {
    it('Klikk på blyantsymbolet', () => {
        cy.getByTestId(`rediger-veiledergruppe_knapp_${gruppenavnRedigert}`).click()
    })
    it('Klikk på slette-knapp', () => {
        cy.getByTestId('veiledergruppe_modal_slette-knapp').click()
    })
    it('Bekreft sletting', () => {
        cy.getByTestId('bekreft-sletting_modal_slett-knapp').click()
    })
    it('Det eksisterer 5 veiledergrupper', () => {
        cy.getByTestId('veiledergruppe_rad-wrapper').should('have.length', 5)
    })
    it('Toasten skal vise "Gruppen er slettet"', () => {
        cy.getByTestId('timed-toast').should("be.visible").contains("Gruppen er slettet")
    })
})
