import * as Api from './../middleware/api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'veilarbportefoljeflatefs/statustall/OK';
export const FEILET = 'veilarbportefoljeflatefs/statustall/FEILET';
export const PENDING = 'veilarbportefoljeflatefs/statustall/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {
        totalt: 0,
        nyeBrukere: 0,
        inaktiveBrukere: 0
    }
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return { ...state, status: STATUS.PENDING };
        case FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case OK: {
            return { ...state, status: STATUS.OK, data: action.data };
        }
        default:
            return state;
    }
}

// Action Creators
export function hentStatusTall(enhet) {
    return doThenDispatch(() => Api.hentStatusTall(enhet), {
        OK,
        FEILET,
        PENDING
    });
}

export function hentStatusTallForVeileder(enhet, veileder) {
    return doThenDispatch(() => Api.hentStatusTallForveileder(enhet, veileder), {
        OK,
        FEILET,
        PENDING
    });
}
