import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../reducer';
import { LeggTilKnapp } from '../../components/knapper/legg-til-knapp';
import VeilederGruppeInnhold from './veiledergrupper-innhold';
import './veileder-gruppe.less';
import { Normaltekst } from 'nav-frontend-typografi';
import Spinner from '../../components/spinner/spinner';
import { VeilederGruppeModal } from '../../components/modal/veiledergruppe/veileder-gruppe-modal';
import { initialState } from '../../ducks/filtrering';
import { FiltervalgModell } from '../../model-interfaces';
import { lageNyGruppe } from '../../ducks/lagret-filter';
import { useEnhetSelector } from '../../hooks/redux/use-enhet-selector';

function FilteringVeilederGrupper() {
    const [visVeilederGruppeModal, setVeilederGruppeModal] = useState(false);

    const lagretFilterState = useSelector((state: AppState) => state.lagretFilter);
    const lagretFilter = lagretFilterState.data;
    const laster = lagretFilterState.status === 'PENDING';

    const dispatch = useDispatch();
    const enhet = useEnhetSelector();

    const submitEndringer = (gruppeNavn: string, filterValg: FiltervalgModell) => {
        enhet && dispatch(lageNyGruppe({
            filterNavn: gruppeNavn,
            filterValg
        }, enhet.enhetId));
    };
    if (laster) {
        return <Spinner/>;
    }

    const sortertVeiledergruppe = lagretFilter.sort((a,b) => a.filterNavn.localeCompare(b.filterNavn));

    return (
        <div>
            {lagretFilter.length > 0
                ? <VeilederGruppeInnhold lagretFilter={sortertVeiledergruppe}/>
                : <div className="veiledergruppe-emptystate">
                    <Normaltekst className="veiledergruppe-emptystate__tekst">
                        Ingen lagrede veiledergrupper på enheten
                    </Normaltekst>
                </div>
            }
            <LeggTilKnapp onClick={() => {
                setVeilederGruppeModal(true);
            }}/>
            <VeilederGruppeModal
                initialVerdi={{gruppeNavn: '', filterValg: initialState, filterId: -1}}
                isOpen={visVeilederGruppeModal}
                onSubmit={submitEndringer}
                modalTittel="Ny veiledergruppe"
                lagreKnappeTekst="Lagre"
                onRequestClose={() => setVeilederGruppeModal(false)}
            />
        </div>
    );
}

export default FilteringVeilederGrupper;