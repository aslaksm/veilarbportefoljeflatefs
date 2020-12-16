import React from 'react';

const table = require('table').table;

const tableConfig = {
    columns: {
        0: {
            width: 90
        }
    }
};

function toViolationTableStr(violations) {
    const violationData = violations.map(violation => {
        const {id, impact, description, nodes, help, helpUrl} = violation;

        const targetsStr = `${nodes
            .map(n => `\n    Location: ${n.target}\n    Source: ${n.html}`)
            .join('\n    ==========\n')}`;

        let descriptionStr = '';
        descriptionStr += `Id: ${id}\n\n`;
        descriptionStr += `Impact: ${impact}\n\n`;
        descriptionStr += `Description: ${description}\n\n`;
        descriptionStr += `Targets: ${targetsStr}\n\n`;
        descriptionStr += `Help: ${help}\n`;
        descriptionStr += `${helpUrl}`;

        return [descriptionStr];
    });

    const violationsWithHeader = [['ACCESSIBILITY VIOLATIONS'], ...violationData];

    return table(violationsWithHeader, tableConfig);
}

function logViolations(violations) {
    cy.task('log', `\n${toViolationTableStr(violations)}\n`);
}

before('Start server', () => {
    cy.configure();
});
xdescribe('Universell utforming', () => {
    it('Hovedside skal oppfylle UU-krav', () => {
        cy.injectAxe();
        cy.checkA11y(null, null, logViolations);
    });
});
