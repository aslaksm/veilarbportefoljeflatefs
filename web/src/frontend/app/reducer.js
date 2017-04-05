import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import persistent from './utils/persistentReducer';
import enheterReducer from './ducks/enheter';
import ledeteksterReducer from './ducks/ledetekster';
import portefoljeReducer from './ducks/portefolje';
import veiledereReducer from './ducks/veiledere';
import portefoljestorrelserReducer from './ducks/portefoljestorrelser';
import veilederpagineringReducer from './ducks/veilederpaginering';
import filtreringReducer, { initialState } from './ducks/filtrering';
import statustallReducer from './ducks/statustall';
import modalReducer from './ducks/modal';
import { slettCleanIUrl } from './utils/utils';

function named(name, reducer) {
    return (state, action) => {
        if (state === undefined) {
            // For å få satt initialState
            return reducer(state, action);
        }

        if (action.name !== name) {
            return state;
        }
        return reducer(state, action);
    };
}

export default combineReducers({
    enheter: enheterReducer,
    ledetekster: ledeteksterReducer,
    portefolje: portefoljeReducer,
    veiledere: veiledereReducer,
    portefoljestorrelser: portefoljestorrelserReducer,
    veilederpaginering: veilederpagineringReducer,
    statustall: statustallReducer,
    // eslint-disable-next-line no-undef
    filtrering: persistent('enhetsState', location, named('enhet', filtreringReducer), slettCleanIUrl, initialState),
    // eslint-disable-next-line no-undef
    filtreringVeileder: persistent('veilederState', location,
        named('veileder', filtreringReducer), slettCleanIUrl, initialState),
    modal: modalReducer,
    form: formReducer
});
