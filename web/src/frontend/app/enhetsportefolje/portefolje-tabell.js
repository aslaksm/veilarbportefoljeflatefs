/* eslint-disable jsx-a11y/onclick-has-focus*/
/* eslint-disable jsx-a11y/no-static-element-interactions*/
import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { veilederShape, brukerShape } from '../proptype-shapes';


export function settVeilederNavnForBrukere(brukere, veiledere) {
    const oppdaterteBrukere = brukere;
    if (brukere.length > 0 && veiledere.length > 0) {
        for (let i = 0; i < brukere.length; i += 1) {
            for (let j = 0; j < veiledere.length; j += 1) {
                if (brukere[i].veilederId === veiledere[j].ident) {
                    oppdaterteBrukere[i].veilederNavn = veiledere[j].navn;
                }
            }
        }
    }
    return oppdaterteBrukere;
}

class PortefoljeTabell extends Component {

    componentWillMount() {
        const { brukere, veiledere } = this.props;
        this.brukereMedVeilederNavn = settVeilederNavnForBrukere(brukere, veiledere);
        this.settSorteringOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this);
    }

    componentWillUpdate() {
        const { brukere, veiledere } = this.props;
        this.brukereMedVeilederNavn = settVeilederNavnForBrukere(brukere, veiledere);
    }

    settSorteringOgHentPortefolje() {
        this.props.settSorteringForPortefolje();
    }

    render() {
        return (
            <table className="tabell enhetsportefolje-tabell" tabIndex="0">
                <thead>
                    <tr>
                        <th>
                            <div className="nav-input">
                                <input className="nav-checkbox" id="checkbox-alle-brukere" type="checkbox" />
                                <label htmlFor="checkbox-alle-brukere" />
                            </div>
                        </th>
                        <th>
                            <a onClick={this.settSorteringOgHentPortefolje} role="button">
                                <FormattedMessage id="portefolje.tabell.navn" />
                            </a>
                        </th>
                        <th>
                            <FormattedMessage id="portefolje.tabell.fodselsnummer" />
                        </th>
                        <th>
                            <FormattedMessage id="portefolje.tabell.veileder" />
                        </th>
                        <th>
                            <FormattedMessage id="portefolje.tabell.navident" />
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.brukereMedVeilederNavn.map(bruker => <tr key={bruker.fnr}>
                        <td>
                            <div className="nav-input">
                                <input
                                    className="nav-checkbox"
                                    id={`checkbox-${bruker.fnr}`}
                                    type="checkbox"
                                    checked={bruker.markert}
                                    onClick={() => this.props.settSomMarkert(bruker.fnr, !bruker.markert)}
                                />
                                <label htmlFor={`checkbox-${bruker.fnr}`} />
                            </div>
                        </td>
                        <td>
                            <a
                                href={`https://${window.location.hostname}/veilarbpersonflatefs/${bruker.fnr}`}
                            >
                                {`${bruker.etternavn}, ${bruker.fornavn}`}
                            </a>
                        </td>
                        <td>{bruker.fnr}</td>
                        {bruker.veilederNavn != null ?
                            <td className="veileder-td">{bruker.veilederNavn}</td> : <td className="ny-bruker-td"><span className="ny-bruker">Ny bruker</span></td>}
                        <td></td>
                        <td className="sikkerhetstiltak-td">
                            {bruker.sikkerhetstiltak.length > 0 ? <span className="sikkerhetstiltak">Sikkerhetstiltak</span> : null}
                            {bruker.diskresjonskode != null ?
                                <span className="diskresjonskode">{`Kode ${bruker.diskresjonskode}`}</span> : null}
                            {bruker.egenAnsatt === true ? <span className="egen-ansatt">Egen ansatt</span> : null}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        );
    }
}

PortefoljeTabell.propTypes = {
    veiledere: PT.arrayOf(veilederShape).isRequired,
    brukere: PT.arrayOf(brukerShape).isRequired,
    settSorteringForPortefolje: PT.func.isRequired,
    settSomMarkert: PT.func.isRequired
};

const mapStateToProps = state => ({
    portefolje: state.portefolje
});

export default connect(mapStateToProps)(PortefoljeTabell);
