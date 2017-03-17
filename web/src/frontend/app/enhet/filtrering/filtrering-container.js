import React, { PropTypes as PT, Component } from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { hentPortefoljeForEnhet } from '../../ducks/filtrering';
import FiltreringStatus from './filtrering-status';
import FiltreringFilter from './filtrering-filter';

class FiltreringContainer extends Component {
    constructor(props) {
        super(props);

        this.oppdaterDatagrunnlag = this.oppdaterDatagrunnlag.bind(this);
    }

    oppdaterDatagrunnlag() {
        const { hentPortefolje, filtervalg, sorteringsrekkefolge, fraIndex, antall, valgtEnhet } = this.props;
        hentPortefolje(valgtEnhet, sorteringsrekkefolge, fraIndex, antall, filtervalg);
    }

    render() {
        return (
            <div className="filtrering-container">
                <Ekspanderbartpanel tittel="Status" tittelProps="systemtittel">
                    <FiltreringStatus />
                </Ekspanderbartpanel>
                <Ekspanderbartpanel tittel="Filter" tittelProps="systemtittel">
                    <FiltreringFilter oppdaterDatagrunnlag={this.oppdaterDatagrunnlag} />
                </Ekspanderbartpanel>
            </div>
        );
    }
}

FiltreringContainer.propTypes = {
    filtervalg: PT.object,
    sorteringsrekkefolge: PT.string,
    fraIndex: PT.number,
    antall: PT.number,
    valgtEnhet: PT.string,
    hentPortefolje: PT.func.isRequired
};

const mapStateToProps = state => ({
    filtervalg: state.filtrering.filtervalg,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    fraIndex: state.portefolje.data.fraIndex,
    antall: state.paginering.sideStorrelse,
    valgtEnhet: state.enheter.valgtEnhet.enhet.enhetId
});

const mapDispatchToProps = dispatch => ({
    hentPortefolje: (enhet, rekkefolge, fra, antall, filtervalg) =>
        dispatch(hentPortefoljeForEnhet(enhet, rekkefolge, fra, antall, filtervalg))
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltreringContainer);
