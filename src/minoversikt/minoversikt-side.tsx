import * as React from 'react';
import DocumentTitle from 'react-document-title';
import Innholdslaster from './../innholdslaster/innholdslaster';
import { ListevisningType } from '../ducks/ui/listevisning';
import './minoversikt-side.less';
import './minoversikt.less';
import { useIdentSelector } from '../hooks/redux/use-inlogget-ident';
import { MinOversiktModalController } from '../components/modal/modal-min-oversikt-controller';
import MinoversiktTabell from './minoversikt-portefolje-tabell';
import MinoversiktTabellOverskrift from './minoversikt-portefolje-tabelloverskrift';
import { MinOversiktWrapper } from './min-oversikt-wrapper';
import TabellOverskrift from '../components/tabell-overskrift';
import { useSelectGjeldendeVeileder } from '../hooks/portefolje/use-select-gjeldende-veileder';
import Toolbar from '../components/toolbar/toolbar';
import ToppMeny from '../topp-meny/topp-meny';
import { useSetStateFromUrl } from '../hooks/portefolje/use-set-state-from-url';
import { useFetchPortefolje } from '../hooks/portefolje/use-fetch-portefolje';
import { useSetPortefoljeSortering } from '../hooks/portefolje/use-sett-sortering';
import FiltreringLabelContainer from '../filtrering/filtrering-label-container';
import { usePortefoljeSelector } from '../hooks/redux/use-portefolje-selector';
import { sortTiltak } from '../filtrering/filtrering-status/filter-utils';
import { hentPortefoljeForVeileder } from '../ducks/portefolje';
import { useDispatch } from 'react-redux';
import { useSyncStateMedUrl } from '../hooks/portefolje/use-sync-state-med-url';
import { useSetLocalStorageOnUnmount } from '../hooks/portefolje/use-set-local-storage-on-unmount';
import '../style.less';
import { useFetchStatusTall } from '../hooks/portefolje/use-fetch-statustall';
import { useSidebarViewStore } from '../store/sidebar/sidebar-view-store';
import FiltreringNavnellerfnr from '../filtrering/filtrering-navnellerfnr';
import { pagineringSetup } from '../ducks/paginering';
import { endreFiltervalg } from '../ducks/filtrering';
import Sidebar from '../components/sidebar/sidebar';
import classNames from 'classnames';

function MinoversiktSide() {
    const innloggetVeilederIdent = useIdentSelector();
    const {portefolje, filtervalg, listevisning, enhetId, sorteringsrekkefolge, sorteringsfelt, enhettiltak} = usePortefoljeSelector(ListevisningType.minOversikt);
    const gjeldendeVeileder = useSelectGjeldendeVeileder();
    const statustall = useFetchStatusTall(gjeldendeVeileder);
    const settSorteringogHentPortefolje = useSetPortefoljeSortering(ListevisningType.minOversikt);
    const dispatch = useDispatch();

    useSetStateFromUrl();
    useSyncStateMedUrl();
    useSetLocalStorageOnUnmount();
    useFetchPortefolje(ListevisningType.minOversikt);

    const visesAnnenVeiledersPortefolje = gjeldendeVeileder !== innloggetVeilederIdent!.ident;
    const antallBrukere = portefolje.data.antallReturnert > portefolje.data.antallTotalt ? portefolje.data.antallTotalt : portefolje.data.antallReturnert;
    const tiltak = sortTiltak(enhettiltak.data.tiltak);
    const {isSidebarHidden, setIsSidebarHidden} = useSidebarViewStore();

    const doEndreFiltervalg = (filterId: string, filterVerdi: any) => {
        dispatch(pagineringSetup({side: 1}));
        dispatch(endreFiltervalg(filterId, filterVerdi));
    };

    const handleOnTabClicked = (tab, selectedTab) => {
        if (isSidebarHidden) {
            setIsSidebarHidden(false);
        } else if (tab.type === selectedTab) {
            setIsSidebarHidden(true);
        }
    };

    const lukkTab = () => {
        setIsSidebarHidden(true);
    };

    return (
        <DocumentTitle title="Min oversikt">
            <div className="side-storrelse">
                <ToppMeny erPaloggetVeileder={!visesAnnenVeiledersPortefolje}/>
                <Innholdslaster avhengigheter={[statustall]}>
                    <MinOversiktWrapper
                        className={classNames('oversikt-sideinnhold portefolje-side',
                            isSidebarHidden ? 'oversikt-sideinnhold__hidden' : '')}>
                        <div className="sokefelt-etikett-container">
                            <FiltreringNavnellerfnr
                                filtervalg={filtervalg}
                                endreFiltervalg={doEndreFiltervalg}
                            />
                            <FiltreringLabelContainer
                                filtervalg={filtervalg}
                                filtergruppe="veileder"
                                enhettiltak={enhettiltak.data.tiltak}
                                listevisning={listevisning}
                                className={visesAnnenVeiledersPortefolje ? 'filtrering-label-container__annen-veileder' : 'filtrering-label-container'}
                            />
                        </div>
                        <Sidebar
                            filtervalg={filtervalg}
                            filtergruppe="veileder"
                            enhettiltak={tiltak}
                            handleOnTabClicked={handleOnTabClicked}
                            isSidebarHidden={isSidebarHidden}
                            lukkTab={lukkTab}
                        />
                        <div
                            className={classNames('oversikt__container', isSidebarHidden ? 'oversikt__container__hidden' : '')}>
                            <div className={antallBrukere > 4 ? 'sticky-container' : 'ikke-sticky__container'}>
                                <TabellOverskrift
                                    className={visesAnnenVeiledersPortefolje ? 'tabelloverskrift__annen-veileder blokk-xxs' : 'tabelloverskrift blokk-xxs'}/>
                                <span className={antallBrukere > 4 ? 'sticky-skygge' : 'ikke-sticky__skygge'}>
                                <div
                                    className={antallBrukere > 4 ? 'toolbar-container' : 'ikke-sticky__toolbar-container'}>
                                        <Toolbar
                                            filtergruppe={ListevisningType.minOversikt}
                                            onPaginering={() => dispatch(hentPortefoljeForVeileder(
                                                enhetId,
                                                gjeldendeVeileder,
                                                sorteringsrekkefolge,
                                                sorteringsfelt,
                                                filtervalg
                                            ))}
                                            gjeldendeVeileder={gjeldendeVeileder}
                                            visesAnnenVeiledersPortefolje={visesAnnenVeiledersPortefolje}
                                            sokVeilederSkalVises={false}
                                            antallTotalt={portefolje.data.antallTotalt}
                                            side="minoversikt"
                                        />
                                        <MinoversiktTabellOverskrift
                                            visesAnnenVeiledersPortefolje={visesAnnenVeiledersPortefolje}
                                            innloggetVeileder={innloggetVeilederIdent!.ident}
                                            settSorteringOgHentPortefolje={settSorteringogHentPortefolje}
                                        />
                                </div>
                                </span>
                            </div>
                            <MinoversiktTabell
                                innloggetVeileder={innloggetVeilederIdent}
                                settSorteringOgHentPortefolje={settSorteringogHentPortefolje}
                                classNameWrapper={antallBrukere > 0 ? 'portefolje__container' : 'portefolje__container__tom-liste'}
                            />
                            <MinOversiktModalController/>
                        </div>
                    </MinOversiktWrapper>
                </Innholdslaster>
            </div>
        </DocumentTitle>
    );
}

export default MinoversiktSide;
