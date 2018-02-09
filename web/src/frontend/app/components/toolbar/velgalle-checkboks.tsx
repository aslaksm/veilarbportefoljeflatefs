import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox } from 'nav-frontend-skjema';
import { markerAlleBrukere } from './../../ducks/portefolje';

interface VelgalleCheckboksProps {
    skalVises: boolean;
    disabled: boolean;
    alleMarkert: boolean;
    markerAlle: (markert: boolean) => void;
}

function VelgalleCheckboks({ skalVises, disabled, markerAlle, alleMarkert }: VelgalleCheckboksProps) {
    if (!skalVises) {
        return null;
    }
    const onClickHandler = () => markerAlle(!alleMarkert);

    return (
        <Checkbox
            label="Velg alle"
            className="velgalle-checkboks"
            checked={alleMarkert}
            disabled={disabled}
            onClick={onClickHandler}
        />
    );
}

const mapStateToProps = (state) => {
    const brukere = state.portefolje.data.brukere;
    const alleMarkert = brukere.length > 0 && brukere.every((bruker) => bruker.markert === true);
    const disabled = brukere.length === 0;

    return { alleMarkert, disabled };
};
const mapDispatchToProps = (dispatch) => bindActionCreators({ markerAlle: markerAlleBrukere }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VelgalleCheckboks);
