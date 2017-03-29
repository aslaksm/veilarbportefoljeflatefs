import React, { PropTypes as PT, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { endreFiltervalg } from '../../ducks/filtrering';
import { hentStatusTall } from '../../ducks/statustall';
import { statustallShape } from '../../proptype-shapes';

class FiltreringStatus extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.props.fetchStatusTall(this.props.enhet);
    }

    handleChange(e) {
        this.props.endreFilter(e.target.id, e.target.checked);
    }

    render() {
        const { nyeBrukere, inaktiveBrukere } = this.props;

        return (
            <div className="filtrering-oversikt panel">
                <div className="typo-element blokk-xs">
                    <FormattedMessage
                        id="filtrering.status.totalt-antall-brukere"
                        values={{ antall: this.props.statustall.data.totalt }}
                    />
                </div>
                <div className="skjema__input">
                    <input
                        className="checkboks"
                        id="nyeBrukere"
                        type="checkbox"
                        onChange={this.handleChange}
                        checked={nyeBrukere}
                    />
                    <label htmlFor="nyeBrukere">
                        <FormattedMessage id="enhet.filtrering.filtrering.oversikt.nye.brukere.checkbox" />
                        &nbsp;({this.props.statustall.data.nyeBrukere})
                    </label>
                </div>
                <div className="skjema__input">
                    <input
                        className="checkboks"
                        id="inaktiveBrukere"
                        type="checkbox"
                        onChange={this.handleChange}
                        checked={inaktiveBrukere}
                    />
                    <label htmlFor="inaktiveBrukere">
                        <FormattedMessage id="enhet.filtrering.filtrering.oversikt.inaktive.brukere.checkbox" />
                        &nbsp;({this.props.statustall.data.inaktiveBrukere})
                    </label>
                </div>
            </div>
        );
    }
}

FiltreringStatus.propTypes = {
    endreFilter: PT.func.isRequired,
    nyeBrukere: PT.bool.isRequired,
    inaktiveBrukere: PT.bool.isRequired,
    fetchStatusTall: PT.func.isRequired,
    enhet: PT.string.isRequired,
    statustall: PT.shape({ data: statustallShape.isRequired }).isRequired
};

const mapStateToProps = (state) => ({
    nyeBrukere: state.filtrering.nyeBrukere,
    inaktiveBrukere: state.filtrering.inaktiveBrukere,
    enhet: state.enheter.valgtEnhet.enhet.enhetId,
    statustall: state.statustall
});

const mapDispatchToProps = (dispatch) => ({
    endreFilter: (filterId, filtervalg) => dispatch(endreFiltervalg(filterId, filtervalg)),
    fetchStatusTall: (enhet) => dispatch(hentStatusTall(enhet))
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltreringStatus);
