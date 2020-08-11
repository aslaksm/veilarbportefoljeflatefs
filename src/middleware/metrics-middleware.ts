import {ENDRE_AKTIVITETER_OG_FJERN_TILTAK_FILTER, ENDRE_FILTER, VEILEDER_SOKT_FRA_TOOLBAR} from '../ducks/filtrering';
import {logEvent} from '../utils/frontend-logger';
import {SETUP} from '../ducks/paginering';
import {SETT_MARKERT_BRUKER_ALLE, SETT_SORTERING, TILDEL_VEILEDER} from '../ducks/portefolje';
import {ActionTypeKeys, Kolonne} from '../ducks/ui/listevisning';
import {VIS_ARBEIDSLISTE_MODAL} from '../ducks/modal';
import {SORTERT_PA} from '../ducks/sortering';
import {NY_FEILET_MODAL, REDIGERING_FEILET_MODAL, SLETTING_FEILET_MODAL} from '../ducks/modal-serverfeil';
import {
    NY_VEILEDERGRUPPER_OK,
    REDIGER_VEILEDERGRUPPER_OK,
    SLETT_VEILEDERGRUPPER_OK
} from '../ducks/veiledergrupper_filter';
import {
    HENT_LAGREDEFILTER_FEILET,
    HENT_LAGREDEFILTER_OK,
    NY_LAGREDEFILTER_FEILET,
    NY_LAGREDEFILTER_OK,
    REDIGER_LAGREDEFILTER_FEILET,
    REDIGER_LAGREDEFILTER_OK,
    SLETT_LAGREDEFILTER_FEILET,
    SLETT_LAGREDEFILTER_OK
} from "../ducks/lagret-filter";
import {antallFilter} from "../components/modal/lagrede-filter/lagrede-filter-utils";

interface FilterEndringData {
    filterId: string;
    filterVerdi: string | string[];
}

enum SideNavn {
    VEILEDER_OVERSIKT = 'VEILEDER_OVERSIKT',
    ENHETENS_OVERSIKT = 'ENHETENS_OVERSIKT',
    MIN_OVERSIKT = 'MIN_OVERSIKT',
    UKJENT = 'UKJENT'
}

export function finnSideNavn(): SideNavn {
    const pathname = window.location.pathname;

    if (pathname.endsWith('/veiledere')) {
        return SideNavn.VEILEDER_OVERSIKT;
    } else if (pathname.endsWith('/enhet')) {
        return SideNavn.ENHETENS_OVERSIKT;
    } else if (pathname.endsWith('/portefolje')) {
        return SideNavn.MIN_OVERSIKT;
    }

    return SideNavn.UKJENT;
}

function finnElementerSomErLagtTil(prevElementer: string[], nyeElementer: string[]): string[] {
    const elementerLagtTil: string[] = [];

    nyeElementer.forEach((element) => {
        if (prevElementer.indexOf(element) === -1) {
            elementerLagtTil.push(element);
        }
    });

    return elementerLagtTil;
}

function finnFiltreringForSide(store: any, sideNavn: SideNavn) {
    const state = store.getState();
    let filtrering;

    switch (sideNavn) {
        case SideNavn.ENHETENS_OVERSIKT:
            filtrering = state.filtrering;
            break;
        case SideNavn.VEILEDER_OVERSIKT:
            filtrering = state.filtreringVeilederoversikt;
            break;
        default:
            filtrering = state.filtreringMinoversikt;
            break;
    }
    return filtrering;
}

function finnSlettetGruppe(store: any, filterId: number) {
    const lagretGruppe = store.getState().lagretFilter.data.find(v => v.filterId === filterId);
    if (lagretGruppe) {
        return lagretGruppe.opprettetDato;
    }
    return undefined;
}

export const metricsMiddleWare = (store: any) => (next: any) => (action: any) => {
    const {type, data, kolonne} = action;
    const sideNavn = finnSideNavn();

    switch (type) {
        case ENDRE_FILTER:
            loggEndreFilter(sideNavn, data, store);
            break;
        case SETUP:
            loggPaginering(sideNavn, data);
            break;
        case TILDEL_VEILEDER:
            loggTildelVeileder(sideNavn);
            break;
        case ActionTypeKeys.VELG_ALTERNATIV:
            loggEndreListevisning(sideNavn, kolonne);
            break;
        case ActionTypeKeys.AVVELG_ALTERNATIV:
            loggAvvelgListevalg(sideNavn, kolonne);
            break;
        case VIS_ARBEIDSLISTE_MODAL:
            loggArbeidslisteApne(sideNavn);
            break;
        case SORTERT_PA:
            loggEndreSortering(sideNavn, data.property, '');
            break;
        case SETT_SORTERING:
            loggEndreSortering(sideNavn, action.sorteringsfelt, action.sorteringsrekkefolge);
            break;
        case SETT_MARKERT_BRUKER_ALLE:
            loggVelgAlle(sideNavn);
            break;
        case VEILEDER_SOKT_FRA_TOOLBAR:
            loggVeilederSoktFraToolbar(sideNavn);
            break;
        case ENDRE_AKTIVITETER_OG_FJERN_TILTAK_FILTER:
            loggEndreAktivitetFilter(sideNavn);
            break;
        case SLETTING_FEILET_MODAL:
            loggSlettVeiledergruppeFeilet();
            break;
        case REDIGERING_FEILET_MODAL:
            loggRedigerVeiledergruppeFeilet();
            break;
        case NY_FEILET_MODAL:
            loggNyVeiledergruppeFeilet();
            break;
        case SLETT_VEILEDERGRUPPER_OK: {
            const opprettetTidpunkt = finnSlettetGruppe(store, action.data);
            loggSlettVeiledergruppeOK(opprettetTidpunkt, finnSideNavn());
            break;
        }
        case NY_VEILEDERGRUPPER_OK:
            loggNyVeiledergruppeOK(action.data.filterValg.veiledere.length, store.getState().lagretFilter.data.length, action.data.filterNavn.trim().length, store.getState().valgtEnhet.data.enhetId, finnSideNavn());
            break;
        case REDIGER_VEILEDERGRUPPER_OK:
            loggRedigerVeiledergruppeOK(action.data.filterValg.veiledere.length, finnSideNavn());
            break;

        //lagrede filter
        case HENT_LAGREDEFILTER_OK:
            const veilederIdentTilNonsens = mapVeilederIdentTilNonsens(store.getState().inloggetVeileder.data.ident);
            loggAntallLagredeFilter(action.data.length, veilederIdentTilNonsens);
            break;
        case NY_LAGREDEFILTER_OK:
            loggAntallBokstaverIFilterNavn(action.data.filterNavn)
            loggAntallFilterOK(action.data.filterValg)
            loggNyttLagretFilterOK();
            break;
        case REDIGER_LAGREDEFILTER_OK:
            loggAntallBokstaverIFilterNavn(action.data.filterNavn)
            loggAntallFilterOK(action.data.filterValg)
            loggRedigerLagretFilterOK();
            break;
        case SLETT_LAGREDEFILTER_OK:
            const opprettetTidspunkt = finnSlettetGruppe(store, action.data)
            loggSlettLagretFilterOK(opprettetTidspunkt);
            break;

        case HENT_LAGREDEFILTER_FEILET:
            loggHentLagretFilterFeilet()
            break;
        case NY_LAGREDEFILTER_FEILET:
            loggNyttLagretFilterFeilet()
            break;
        case REDIGER_LAGREDEFILTER_FEILET:
            loggRedigerLagretFilterFeilet()
            break;
        case SLETT_LAGREDEFILTER_FEILET:
            loggSlettLagretFilterFeilet()
            break;
    }

    return next(action);
};

function mapVeilederIdentTilNonsens(veilederIdent: string) {
    return [...veilederIdent]
        .map(veilederChar => veilederChar.charCodeAt(0) << 6)
        .map(veilederChar => veilederChar % 255)
        .map(hexChar => hexChar.toString(16))
        .join('');
}

export const loggEndreFilter = (sideNavn: SideNavn, data: FilterEndringData, store: any) => {
    const veilederIdent = mapVeilederIdentTilNonsens(store.getState().inloggetVeileder.data.ident);
    if (data.filterId === 'veilederNavnQuery') {
        return;
    }

    if (Array.isArray(data.filterVerdi)) {

        const filtrering = finnFiltreringForSide(store, sideNavn);
        const prevFilter = filtrering[data.filterId];
        const lagtTilFilterVerdier = finnElementerSomErLagtTil(prevFilter, data.filterVerdi);

        lagtTilFilterVerdier.forEach((verdi) => {
            logEvent('portefolje.metrikker.endre_filter', {
                sideNavn,
                filter: data.filterId,
                verdi,
                veilederIdent
            });
        });

    } else {
        logEvent('portefolje.metrikker.endre_filter', {
            sideNavn,
            filter: data.filterId,
            verdi: data.filterVerdi,
            veilederIdent
        });
    }

};

const loggEndreAktivitetFilter = (sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.endre_filter', {sideNavn, filter: 'aktiviteter'});
};

const loggPaginering = (sideNavn: SideNavn, data: any) => {
    if (data.side > 1) {
        logEvent('portefolje.metrikker.paginering', {sideNavn});
    } else if (data.seAlle) {
        logEvent('portefolje.metrikker.se_alle', {sideNavn});
    }
};

const loggTildelVeileder = (sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.tildel_veileder', {sideNavn});
};

const loggEndreListevisning = (sideNavn: SideNavn, kolonne: Kolonne) => {
    logEvent('portefolje.metrikker.listevisning_endret', {sideNavn, kolonne});
};

const loggAvvelgListevalg = (sideNavn: SideNavn, kolonne: Kolonne) => {
    logEvent('portefolje.metrikker.listevisning_avvelget', {sideNavn, kolonne});
};

const loggArbeidslisteApne = (sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.arbeidsliste_apne', {sideNavn});
};

const loggEndreSortering = (sideNavn: SideNavn, sorteringsfelt: string, rekkefolge: string) => {
    if ((sorteringsfelt !== 'etternavn' || rekkefolge !== 'ascending')
        && (sorteringsfelt !== 'ikke_satt' || rekkefolge !== 'ikke_satt')) {
        logEvent('portefolje.metrikker.endre_sortering', {sideNavn, sorteringsfelt, rekkefolge});
    }
};

const loggVeilederSoktFraToolbar = (sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.veileder_sokt_fra_toolbar', {sideNavn});
};

const loggVelgAlle = (sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.velg_alle', {sideNavn});
};

//veiledergrupper
const loggNyVeiledergruppeFeilet = () => {
    logEvent('portefolje.metrikker.veiledergrupper.oppretting-feilet');
};

const loggRedigerVeiledergruppeFeilet = () => {
    logEvent('portefolje.metrikker.veiledergrupper.lagring-feilet');
};

const loggSlettVeiledergruppeFeilet = () => {
    logEvent('portefolje.metrikker.veiledergrupper.sletting-feilet');
};

const loggNyVeiledergruppeOK = (antallVeiledere, antallGrupper, gruppeNavn, enhetId, sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.veiledergrupper.oppretting-vellykket',
        {veiledere: antallVeiledere, antallGrupper, gruppeNavn},
        {enhetId, sideNavn});
};

const loggRedigerVeiledergruppeOK = (antallVeiledere, sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.veiledergrupper.lagring-vellykket',
        {veiledere: antallVeiledere},
        {sideNavn});
};

const loggSlettVeiledergruppeOK = (opprettetTidspunkt, sideNavn: SideNavn) => {
    logEvent('portefolje.metrikker.veiledergrupper.sletting-vellykket',
        {levetid: (new Date().getTime() - new Date(opprettetTidspunkt).getTime()) / (1000 * 3600 * 24)},
        {sideNavn});
};


//Lagrede filter
const loggNyttLagretFilterOK = () => {
    logEvent('portefolje.metrikker.lagredefilter.oppretting-vellykket',
        {},
        {});
};

const loggRedigerLagretFilterOK = () => {
    logEvent('portefolje.metrikker.lagredefilter.lagring-vellykket',
        {},
        {});
};


const loggSlettLagretFilterOK = (opprettetTidspunkt) => {
    logEvent('portefolje.metrikker.lagredefilter.sletting-vellykket',
        {levetid: (new Date().getTime() - new Date(opprettetTidspunkt).getTime()) / (1000 * 3600 * 24)},
        {});
};

const loggHentLagretFilterFeilet = () => {
    logEvent('portefolje.metrikker.lagredefilter.henting-feilet');
};

const loggNyttLagretFilterFeilet = () => {
    logEvent('portefolje.metrikker.lagredefilter.oppretting-feilet');
};

const loggRedigerLagretFilterFeilet = () => {
    logEvent('portefolje.metrikker.lagredefilter.lagring-feilet');
};

const loggSlettLagretFilterFeilet = () => {
    logEvent('portefolje.metrikker.lagredefilter.sletting-feilet');
};

const loggAntallFilterOK = (filterValg) => {
    logEvent('portefolje.metrikker.lagredefilter.antall-filter',
        {antallFilter: antallFilter(filterValg)})
};

const loggAntallBokstaverIFilterNavn = (filterNavn) => {
    logEvent('portefolje.metrikker.lagredefilter.filternavn',
        {filterNavn: filterNavn.length})
};

const loggAntallLagredeFilter = (antallFilter, veilederIdentHash) => {
    logEvent('portefolje.metrikker.lagredefilter.antall-per-veileder',
        {antallFilter: antallFilter, id: veilederIdentHash})
}
