import * as React from 'react';
import BrukerNavn from '../components/tabell/brukernavn';
import BrukerFnr from '../components/tabell/brukerfnr';
import UkeKolonne from '../components/tabell/kolonner/ukekolonne';
import {
    I_AVTALT_AKTIVITET,
    MOTER_IDAG,
    UNDER_VURDERING,
    UTLOPTE_AKTIVITETER,
    VENTER_PA_SVAR_FRA_BRUKER,
    VENTER_PA_SVAR_FRA_NAV,
    ytelseAapSortering,
    ytelsevalg
} from '../filtrering/filter-konstanter';
import DatoKolonne from '../components/tabell/kolonner/datokolonne';
import {Kolonne} from '../ducks/ui/listevisning';
import {BrukerModell, FiltervalgModell, VeilederModell} from '../model-interfaces';
import {
    aapRettighetsperiode,
    nesteUtlopsdatoEllerNull,
    parseDatoString,
    utledValgteAktivitetsTyper,
    utlopsdatoUker
} from '../utils/utils';
import VeilederNavn from '../components/tabell/veiledernavn';
import VeilederId from '../components/tabell/veilederid';
import TidKolonne from '../components/tabell/kolonner/tidkolonne';
import {dagerSiden, klokkeslettTilMinutter, minuttDifferanse, oppfolgingStartetDato} from '../utils/dato-utils';
import VarighetKolonne from '../components/tabell/kolonner/varighetkolonne';
import {OrNothing} from '../utils/types/types';
import './enhetsportefolje.less';
import './brukerliste.less';
import {DagerSidenKolonne} from '../components/tabell/kolonner/dagersidenkolonne';
import {TekstKolonne} from '../components/tabell/kolonner/tekstkolonne';
import SisteEndringKategori from '../components/tabell/sisteendringkategori';

interface EnhetKolonnerProps {
    className?: string;
    bruker: BrukerModell;
    enhetId: OrNothing<string>;
    filtervalg: FiltervalgModell;
    valgteKolonner: Kolonne[];
    brukersVeileder?: VeilederModell;
}

function EnhetKolonner({className, bruker, enhetId, filtervalg, valgteKolonner, brukersVeileder}: EnhetKolonnerProps) {
    const ytelsevalgIntl = ytelsevalg();
    const {ytelse} = filtervalg;
    const utlopsdatoUkerIgjen = utlopsdatoUker(bruker.utlopsdato);
    const venterPaSvarFraBruker = bruker.venterPaSvarFraBruker ? new Date(bruker.venterPaSvarFraBruker) : null;
    const venterPaSvarFraNAV = bruker.venterPaSvarFraNAV ? new Date(bruker.venterPaSvarFraNAV) : null;
    const nyesteUtlopteAktivitet = bruker.nyesteUtlopteAktivitet ? new Date(bruker.nyesteUtlopteAktivitet) : null;
    const ytelseErValgtKolonne = valgteKolonner.includes(Kolonne.UTLOP_YTELSE);
    const ytelseAapVedtaksperiodeErValgtKolonne = valgteKolonner.includes(Kolonne.VEDTAKSPERIODE);
    const ytelseAapRettighetsperiodeErValgtKolonne = valgteKolonner.includes(Kolonne.RETTIGHETSPERIODE);
    const valgteAktivitetstyper = utledValgteAktivitetsTyper(bruker.aktiviteter, filtervalg.aktiviteter);
    const ferdigfilterListe = !!filtervalg ? filtervalg.ferdigfilterListe : '';
    const moteStartTid = klokkeslettTilMinutter(bruker.moteStartTid);
    const varighet = minuttDifferanse(bruker.moteSluttTid, bruker.moteStartTid);
    const erAapYtelse = !!ytelse && Object.keys(ytelseAapSortering).includes(ytelse);
    const rettighetsPeriode = aapRettighetsperiode(ytelse, bruker.aapmaxtidUke, bruker.aapUnntakUkerIgjen);
    const iAvtaltAktivitet: boolean =
        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) && valgteKolonner.includes(Kolonne.AVTALT_AKTIVITET);

    const avtaltAktivitetOgTiltak: boolean =
        !!valgteAktivitetstyper &&
        filtervalg.tiltakstyper.length === 0 &&
        valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET);

    const forenkletAktivitetOgTiltak =
        valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET) &&
        (filtervalg.tiltakstyper.length > 0 || filtervalg.aktiviteterForenklet.length > 0);

    const sisteEndringTidspunkt = bruker.sisteEndringTidspunkt ? new Date(bruker.sisteEndringTidspunkt) : null;
    return (
        <div className={className}>
            <BrukerNavn className="col col-xs-2" bruker={bruker} enhetId={enhetId} />
            <BrukerFnr className="col col-xs-2" bruker={bruker} />
            <DatoKolonne
                className="col col-xs-2"
                skalVises={valgteKolonner.includes(Kolonne.OPPFOLGINGSTARTET)}
                dato={oppfolgingStartetDato(bruker.oppfolgingStartdato)}
            />
            <VeilederNavn
                className="col col-xs-2"
                bruker={bruker}
                skalVises={valgteKolonner.includes(Kolonne.VEILEDER)}
                veileder={brukersVeileder}
            />
            <VeilederId
                className="col col-xs-2"
                bruker={bruker}
                skalVises={valgteKolonner.includes(Kolonne.NAVIDENT)}
            />
            <UkeKolonne
                className="col col-xs-2"
                ukerIgjen={bruker.dagputlopUke}
                minVal={2}
                skalVises={
                    ytelseErValgtKolonne &&
                    (ytelse === ytelsevalgIntl.DAGPENGER ||
                        ytelse === ytelsevalgIntl.ORDINARE_DAGPENGER ||
                        ytelse === ytelsevalgIntl.DAGPENGER_MED_PERMITTERING_FISKEINDUSTRI ||
                        ytelse === ytelsevalgIntl.LONNSGARANTIMIDLER_DAGPENGER)
                }
            />
            <UkeKolonne
                className="col col-xs-2"
                ukerIgjen={bruker.permutlopUke}
                minVal={2}
                skalVises={ytelseErValgtKolonne && ytelse === ytelsevalgIntl.DAGPENGER_MED_PERMITTERING}
            />
            <UkeKolonne
                className="col col-xs-2"
                ukerIgjen={utlopsdatoUkerIgjen}
                minVal={2}
                skalVises={ytelseErValgtKolonne && erAapYtelse}
            />
            <UkeKolonne
                className="col col-xs-2"
                ukerIgjen={utlopsdatoUkerIgjen}
                minVal={2}
                skalVises={ytelseAapVedtaksperiodeErValgtKolonne && erAapYtelse}
            />
            <UkeKolonne
                className="col col-xs-2"
                ukerIgjen={rettighetsPeriode}
                minVal={2}
                skalVises={ytelseAapRettighetsperiodeErValgtKolonne && erAapYtelse}
            />
            <UkeKolonne
                className="col col-xs-2"
                ukerIgjen={utlopsdatoUkerIgjen}
                minVal={2}
                skalVises={ytelseErValgtKolonne && ytelse === ytelsevalgIntl.TILTAKSPENGER}
            />
            <DatoKolonne
                className="col col-xs-2"
                dato={venterPaSvarFraBruker}
                skalVises={
                    !!ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_BRUKER) &&
                    valgteKolonner.includes(Kolonne.VENTER_SVAR)
                }
            />
            <DatoKolonne
                className="col col-xs-2"
                dato={venterPaSvarFraNAV}
                skalVises={
                    !!ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_NAV) &&
                    valgteKolonner.includes(Kolonne.VENTER_SVAR)
                }
            />
            <DatoKolonne
                className="col col-xs-2"
                dato={nyesteUtlopteAktivitet}
                skalVises={
                    !!ferdigfilterListe?.includes(UTLOPTE_AKTIVITETER) &&
                    valgteKolonner.includes(Kolonne.UTLOPTE_AKTIVITETER)
                }
            />
            <DatoKolonne
                className="col col-xs-2"
                dato={nesteUtlopsdatoEllerNull(bruker.aktiviteter || undefined)}
                skalVises={iAvtaltAktivitet}
            />
            <DatoKolonne
                className="col col-xs-2"
                dato={parseDatoString(bruker.nesteUtlopsdatoAktivitet)}
                skalVises={avtaltAktivitetOgTiltak || forenkletAktivitetOgTiltak}
            />
            <TidKolonne
                className="col col-xs-2"
                dato={moteStartTid}
                skalVises={!!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_IDAG)}
            />
            <VarighetKolonne
                className="col col-xs-2"
                dato={varighet}
                skalVises={!!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_VARIGHET)}
            />
            <TekstKolonne
                tekst={bruker.vedtakStatus}
                skalVises={
                    !!ferdigfilterListe?.includes(UNDER_VURDERING) && valgteKolonner.includes(Kolonne.VEDTAKSTATUS)
                }
                className="col col-xs-2"
            />
            <DagerSidenKolonne
                className="col col-xs-2"
                dato={dagerSiden(bruker.vedtakStatusEndret)}
                skalVises={
                    !!ferdigfilterListe?.includes(UNDER_VURDERING) &&
                    valgteKolonner.includes(Kolonne.VEDTAKSTATUS_ENDRET)
                }
            />
            <TekstKolonne
                tekst={!!bruker.ansvarligVeilederForVedtak ? bruker.ansvarligVeilederForVedtak : ' '}
                skalVises={
                    !!ferdigfilterListe?.includes(UNDER_VURDERING) &&
                    valgteKolonner.includes(Kolonne.ANSVARLIG_VEILEDER_FOR_VEDTAK)
                }
                className="col col-xs-2"
            />
            <SisteEndringKategori
                bruker={bruker}
                enhetId={enhetId}
                skalVises={!!filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING)}
                className="col col-xs-2"
            />
            <DatoKolonne
                className="col col-xs-2"
                dato={sisteEndringTidspunkt}
                skalVises={!!filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING_DATO)}
            />
        </div>
    );
}

export default EnhetKolonner;
