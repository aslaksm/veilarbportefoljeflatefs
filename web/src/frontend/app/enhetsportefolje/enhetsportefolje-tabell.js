import React, { Component, PropTypes as PT } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tabelletiketter from './../components/tabelletiketter/tabelletiketter';
import { veilederShape, brukerShape, portefoljeShape, filtervalgShape } from '../proptype-shapes';
import { markerAlleBrukere, settBrukerSomMarkert } from './../ducks/portefolje';
import TomPortefoljeModal from '../modal/tom-portefolje-modal';
import { visModal, skjulModal } from '../ducks/modal';
import { initialState } from '../ducks/filtrering';
import { ytelseFilterErAktiv } from '../utils/utils';
import Utlopsdatokolonne from '../tabell/kolonne_utlopsdato';

const settSammenNavn = (bruker) => {
    if (bruker.etternavn === '' && bruker.fornavn === '') {
        return '';
    }
    return `${bruker.etternavn}, ${bruker.fornavn}`;
};

class EnhetsportefoljeTabell extends Component {

    componentWillMount() {
        this.settSorteringOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this);
        this.visModalDersomPortefoljeErTom();
    }

    settSorteringOgHentPortefolje(felt) {
        this.props.settSorteringForPortefolje(felt);
    }

    visModalDersomPortefoljeErTom() {
        const { toggleVisModal, antallTotalt, filtervalg } = this.props;
        if (antallTotalt === 0 && JSON.stringify(filtervalg) === JSON.stringify(initialState)) {
            toggleVisModal();
        }
    }

    render() {
        const {
            brukere,
            veiledere,
            settSomMarkertAlle,
            settMarkert,
            portefolje,
            modalSkalVises,
            toggleSkjulModal,
            valgtEnhet,
            sorteringsrekkefolge,
            filtervalg
        } = this.props;

        const sorterEtternavn = portefolje.sorteringsfelt === 'etternavn';
        const sorterFodelsnummer = portefolje.sorteringsfelt === 'fodselsnummer';
        const sorterUtlopsdato = portefolje.sorteringsfelt === 'utlopsdato';

        const utlopsdatoHeader = !!filtervalg && ytelseFilterErAktiv(filtervalg.ytelse) ?
            (<th className="tabell-element-center">
                <FormattedMessage id="portefolje.tabell.utlopsdato" />
            </th>)
            :
            null;

        const mmddyyHeader = (
            <th className="tabell-element-center">
                <button
                    onClick={() => this.settSorteringOgHentPortefolje('utlopsdato')}
                    className={classNames('sortering-link', { valgt: sorterUtlopsdato })}
                    aria-pressed={sorterUtlopsdato}
                    aria-label={(sorterUtlopsdato && sorteringsrekkefolge !== 'ikke_satt') ?
                            sorteringsrekkefolge : 'inaktiv'}
                >
                    <FormattedMessage id="portefolje.tabell.ddmmyy" />
                </button>
            </th>
            );

        const alleMarkert = brukere.length > 0 && brukere.every((bruker) => bruker.markert);
        return (
            <div>
                <TomPortefoljeModal skjulModal={toggleSkjulModal} visModal={modalSkalVises} />
                <table className="tabell portefolje-tabell typo-avsnitt">
                    <thead className="extra-head">
                        <tr>
                            <th />
                            <th colSpan="2">Bruker</th>
                            {utlopsdatoHeader}
                            <th colSpan="4">Veileder</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>
                                { /* TODO hent checkbokser fra nav-frontend-skjema */}
                                <div className="skjema__input">
                                    <input
                                        className="checkboks"
                                        id="checkbox-alle-brukere"
                                        type="checkbox"
                                        checked={alleMarkert}
                                        onClick={() => settSomMarkertAlle(!alleMarkert)}
                                    />
                                    <label className="skjema__label" htmlFor="checkbox-alle-brukere" />
                                </div>
                            </th>
                            <th>
                                <button
                                    onClick={() => this.settSorteringOgHentPortefolje('etternavn')}
                                    className={classNames('sortering-link', { valgt: sorterEtternavn })}
                                    aria-pressed={sorterEtternavn}
                                    aria-label={(sorterEtternavn && sorteringsrekkefolge !== 'ikke_satt') ?
                                        sorteringsrekkefolge : 'inaktiv'}
                                >
                                    <FormattedMessage id="enhet.veiledere.tabell.etternavn" />
                                </button>
                                <FormattedMessage id="enhet.veiledere.tabell.fornavn" />
                            </th>
                            <th className="tabell-element-center">
                                <button
                                    onClick={() => this.settSorteringOgHentPortefolje('fodselsnummer')}
                                    className={classNames('sortering-link', { valgt: sorterFodelsnummer })}
                                    aria-pressed={sorterFodelsnummer}
                                    aria-label={sorterFodelsnummer && sorteringsrekkefolge !== 'ikke_satt' ?
                                        sorteringsrekkefolge : 'inaktiv'}
                                >
                                    <FormattedMessage id="portefolje.tabell.fodselsnummer" />
                                </button>
                            </th>
                            {ytelseFilterErAktiv(filtervalg.ytelse) ? mmddyyHeader : null}
                            <th>
                                <FormattedMessage id="enhet.veiledere.tabell.etternavn" />
                                <FormattedMessage id="enhet.veiledere.tabell.fornavn" />
                            </th>
                            <th>
                                <FormattedMessage id="portefolje.tabell.navident" />
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {brukere.map((bruker) => <tr key={bruker.guid}>
                            <td>
                                <div className="skjema__input" hidden={bruker.fnr.length === 0}>
                                    <input
                                        className="checkboks"
                                        id={`checkbox-${bruker.guid}`}
                                        type="checkbox"
                                        checked={!!bruker.markert}
                                        onClick={() => settMarkert(bruker.guid, !bruker.markert)}
                                    />
                                    <label className="skjema__label" htmlFor={`checkbox-${bruker.guid}`} />
                                </div>
                            </td>
                            <th>
                                <a// eslint-disable-next-line no-undef
                                    href={`https://${window.location.hostname}/veilarbpersonflatefs/` +
                                `${bruker.fnr}?enhet=${valgtEnhet}`}
                                    className="til-bruker-link"
                                >
                                    {settSammenNavn(bruker)}
                                </a>
                            </th>
                            <td className="tabell-element-center">{bruker.fnr}</td>
                            {
                                ytelseFilterErAktiv(filtervalg.ytelse) && bruker.utlopsdato !== null ?
                                    <Utlopsdatokolonne utlopsdato={bruker.utlopsdato} />
                                    : null
                            }
                            {
                                bruker.veilederId ? <td className="veileder-td">{veiledere
                                        .filter((veileder) => veileder.ident === bruker.veilederId)
                                        .map((veileder) => (settSammenNavn(veileder)))}</td>
                                    :
                                <td>
                                    <Tabelletiketter type="nybruker">Ny bruker</Tabelletiketter>
                                </td>
                            }
                            <td >
                                {bruker.veilederId || ''}
                            </td>
                            <td>
                                {bruker.sikkerhetstiltak.length > 0 ?
                                    <Tabelletiketter type="sikkerhetstiltak">Sikkerhetstiltak</Tabelletiketter> : null}
                                {bruker.diskresjonskode !== null ?
                                    <Tabelletiketter type="diskresjonskode">
                                        {`Kode ${bruker.diskresjonskode}`}
                                    </Tabelletiketter> : null}
                                {bruker.egenAnsatt === true ?
                                    <Tabelletiketter type="egen-ansatt">Egen ansatt</Tabelletiketter> : null}
                                {bruker.erDoed === true ?
                                    <Tabelletiketter type="doed">Død</Tabelletiketter> : null}
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

EnhetsportefoljeTabell.propTypes = {
    antallTotalt: PT.number.isRequired,
    veiledere: PT.arrayOf(veilederShape).isRequired,
    brukere: PT.arrayOf(brukerShape).isRequired,
    portefolje: PT.shape({
        data: portefoljeShape.isRequired,
        sorteringsfelt: PT.string.isRequired,
        sorteringsrekkefolge: PT.string.isRequired
    }).isRequired,
    settSorteringForPortefolje: PT.func.isRequired,
    sorteringsrekkefolge: PT.string.isRequired,
    settMarkert: PT.func.isRequired,
    settSomMarkertAlle: PT.func.isRequired,
    modalSkalVises: PT.bool.isRequired,
    toggleSkjulModal: PT.func.isRequired,
    toggleVisModal: PT.func.isRequired,
    filtervalg: filtervalgShape.isRequired,
    valgtEnhet: PT.string.isRequired
};

const mapStateToProps = (state) => ({
    antallTotalt: state.portefolje.data.antallTotalt,
    modalSkalVises: state.modal.visModal,
    filtervalg: state.filtrering,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    valgtEnhet: state.enheter.valgtEnhet.enhet.enhetId
});

const mapDispatchToProps = (dispatch) => ({
    settSomMarkertAlle: (markert) => dispatch(markerAlleBrukere(markert)),
    settMarkert: (guid, markert) => dispatch(settBrukerSomMarkert(guid, markert)),
    toggleVisModal: () => dispatch(visModal()),
    toggleSkjulModal: () => dispatch(skjulModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhetsportefoljeTabell);
