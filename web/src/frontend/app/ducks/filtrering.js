import { hentPortefoljeForEnhet, hentPortefoljeForVeileder } from './portefolje';
import { DEFAULT_PAGINERING_STORRELSE } from './../konstanter';

// Actions
export const ENDRE_FILTER = 'filtrering/ENDRE_FILTER';
export const SETT_FILTERVALG = 'filtrering/SETT_FILTERVALG';
export const SLETT_ENKELT_FILTER = 'filtrering/SLETT_ENKELT_FILTER';
export const CLEAR_FILTER = 'filtrering/CLEAR_FILTER';

//  Reducer
export const initialState = {
    brukerstatus: null,
    alder: [],
    kjonn: [],
    fodselsdagIMnd: [],
    innsatsgruppe: [],
    formidlingsgruppe: [],
    servicegruppe: [],
    rettighetsgruppe: [],
    veiledere: [],
    aktiviteter: {},
    ytelse: null
};

function fjern(verdi, fjernVerdi) {
    if (typeof verdi === 'boolean') {
        return false;
    } else if (Array.isArray(verdi)) {
        return verdi.filter((enkeltVerdi) => enkeltVerdi !== fjernVerdi);
    } else if (fjernVerdi && typeof verdi === 'object') {
        return Object.entries(verdi)
            .filter(([key]) => key !== fjernVerdi)
            .reduce((acc, [key, value]) => ({...acc, [key]: value}), {});
    } else if (fjernVerdi === null) {
        return null;
    }

    throw new Error(`Kan ikke håndtere fjerning av ${fjernVerdi} fra ${verdi}`);
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CLEAR_FILTER:
            return initialState;
        case ENDRE_FILTER:
            return {
                ...state,
                [action.data.filterId]: action.data.filterVerdi
            };
        case SLETT_ENKELT_FILTER:
            return {
                ...state,
                [action.data.filterId]: fjern(state[action.data.filterId], action.data.filterVerdi)
            };
        case SETT_FILTERVALG:
            return { ...action.data };
        default:
            return state;
    }
}

// Action Creators
export function oppdaterPortefolje(getState, dispatch, filtergruppe, veileder = {}) {
    const state = getState();
    const enhet = state.enheter.valgtEnhet.enhet.enhetId;
    const rekkefolge = state.portefolje.sorteringsrekkefolge;
    const sorteringfelt = state.portefolje.sorteringsfelt;
    const antall = DEFAULT_PAGINERING_STORRELSE;
    let nyeFiltervalg;
    if (filtergruppe === 'enhet') {
        nyeFiltervalg = state.filtrering;
        hentPortefoljeForEnhet(enhet, rekkefolge, sorteringfelt, 0, antall, nyeFiltervalg)(dispatch);
    } else if (filtergruppe === 'veileder') {
        nyeFiltervalg = state.filtreringVeileder;
        hentPortefoljeForVeileder(enhet, veileder, rekkefolge, sorteringfelt, 0, antall, nyeFiltervalg)(dispatch);
    }
}

export function endreFiltervalg(filterId, filterVerdi, filtergruppe = 'enhet', veileder) {
    return (dispatch, getState) => {
        dispatch({ type: ENDRE_FILTER, data: { filterId, filterVerdi }, name: filtergruppe });
        oppdaterPortefolje(getState, dispatch, filtergruppe, veileder);
    };
}

export function slettEnkeltFilter(filterId, filterVerdi, filtergruppe = 'enhet', veileder) {
    return (dispatch, getState) => {
        dispatch({ type: SLETT_ENKELT_FILTER, data: { filterId, filterVerdi }, name: filtergruppe });
        oppdaterPortefolje(getState, dispatch, filtergruppe, veileder);
    };
}

export function clearFiltervalg(filtergruppe = 'enhet', veileder) {
    return (dispatch, getState) => {
        dispatch({ type: CLEAR_FILTER, name: filtergruppe });
        oppdaterPortefolje(getState, dispatch, filtergruppe, veileder);
    };
}
