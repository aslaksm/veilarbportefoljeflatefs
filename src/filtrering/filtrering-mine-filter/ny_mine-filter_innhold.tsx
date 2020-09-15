import React, {useEffect, useRef, useState} from 'react';
import './ny_mine-filter-innhold.less';
import '../../components/sidebar/sidebar.less';
import {MineFilter} from '../../ducks/mine-filter';
import {Normaltekst} from 'nav-frontend-typografi';
import DragAndDropContainer from './dragAndDrop/drag-and-drop-container';

interface LagredeFilterInnholdProps {
    lagretFilter: MineFilter[];
    filtergruppe: string;
    fjernUtilgjengeligeFilter: (elem: MineFilter) => void;
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function NyLagredeFilterInnhold(props: LagredeFilterInnholdProps) {
    const outerDivRef = useRef<HTMLDivElement>(null);
    const [isDraggable, setisDraggable] = useState(false);

    const filtrertListe = () => {
        return props.lagretFilter.filter((elem) => props.fjernUtilgjengeligeFilter(elem));
    };

    useEffect(() => {
        if (outerDivRef.current && isOverflown(outerDivRef.current)) {
            outerDivRef.current.style.borderTop = '1px solid #888888';
            outerDivRef.current.style.borderBottom = '1px solid #888888';
        }
    });

    const hentFiltrertListeinnhold = () => {
        return (
            <div className="ny__mine-filter__valgfelt" ref={outerDivRef}>
                <DragAndDropContainer stateFilterOrder={filtrertListe()} filtergruppe={props.filtergruppe} />
            </div>
        );
    };

    const getEmptyState = () => {
        return (
            <div className="mine-filter-emptystate">
                <Normaltekst className="mine-filter-emptystate__tekst">Ingen lagrede filter</Normaltekst>
            </div>
        );
    };

    return filtrertListe().length > 0 ? hentFiltrertListeinnhold() : getEmptyState();
}

export default NyLagredeFilterInnhold;
