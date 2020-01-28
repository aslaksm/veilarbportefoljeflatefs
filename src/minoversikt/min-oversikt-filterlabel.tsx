import FiltreringLabelContainer from "../filtrering/filtrering-label-container";
import * as React from "react";
import {useParams} from "react-router";
import {useIdentSelector} from "../hooks/redux/use-inlogget-ident";
import {useSelector} from "react-redux";
import {AppState} from "../reducer";

export function MinOversiktFilterLabelContainer(props: {visesAnnenVeiledersPortefolje: boolean}) {
    const {ident} = useParams();
    const innloggetIdent = useIdentSelector();
    const gjeldendeVeileder = ident? ident : innloggetIdent!.ident;

    const enhettiltak = useSelector((state: AppState) => state.enhettiltak.data.tiltak);
    const listevisning = useSelector((state: AppState) =>  state.ui.listevisningMinOversikt);
    const filtervalg = useSelector((state: AppState) =>  state.filtreringMinoversikt);
}