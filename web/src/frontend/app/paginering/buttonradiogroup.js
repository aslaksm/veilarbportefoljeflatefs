import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { settVisningsmodus } from '../ducks/veilederpaginering';
import { DIAGRAMVISNING, TABELLVISNING } from '../minoversikt/minoversikt-konstanter';
import { guid } from './../utils/utils';

class ButtonRadiogroup extends Component {
    constructor(props) {
        super(props);

        this.guid = guid();
    }

    componentWillUnmount() {
        this.props.endreVisningsmodus(TABELLVISNING);
    }

    render() {
        const { visningsmodus, endreVisningsmodus } = this.props;

        return (
            <div className="visningsgruppe">
                <div className="visningsgruppe__knapp">
                    <input
                        id={`diagramvisning-${this.guid}`}
                        name={`visningsmodus-${this.guid}`}
                        type="radio"
                        onChange={() => endreVisningsmodus(DIAGRAMVISNING)}
                        value="diagramvisning"
                        checked={visningsmodus === DIAGRAMVISNING}
                        aria-selected={visningsmodus === DIAGRAMVISNING}
                    />
                    <label htmlFor={`diagramvisning-${this.guid}`} className="typo-undertekst">Vis som diagram</label>
                </div>
                <div className="visningsgruppe__knapp">
                    <input
                        id={`tabellvisning-${this.guid}`}
                        name={`visningsmodus-${this.guid}`}
                        type="radio"
                        onChange={() => endreVisningsmodus(TABELLVISNING)}
                        value="tabellvisning"
                        checked={visningsmodus === TABELLVISNING}
                        aria-selected={visningsmodus === TABELLVISNING}
                    />
                    <label htmlFor={`tabellvisning-${this.guid}`} className="typo-undertekst">Vis som tabell</label>
                </div>
            </div>
        );
    }
}

ButtonRadiogroup.defaultProps = {
    visningsmodus: TABELLVISNING
};

const mapStateToProps = (state) => ({
    visningsmodus: state.veilederpaginering.visningsmodus
});

const mapDispatchToProps = (dispatch) => ({
    endreVisningsmodus: (modus) => {
        dispatch(settVisningsmodus(modus));
    },
});

ButtonRadiogroup.propTypes = {
    visningsmodus: PT.string.isRequired,
    endreVisningsmodus: PT.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRadiogroup);
