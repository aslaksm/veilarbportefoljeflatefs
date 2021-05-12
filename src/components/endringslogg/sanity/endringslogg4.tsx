import {default as React, RefObject, useRef, useState} from 'react';
import {ReactComponent as AlarmIcon} from '../icon-v3.svg'
import {EndringsloggData} from './endringslogg-groq1';
import TransitionContainer from '../utils/transition-container';
import {useEventListener} from '../../../hooks/use-event-listener';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import EndringsloggForside from './endringslogg-forside3';

interface EndringsProps {
    innhold: EndringsloggData[];
    onOpen: () => void;
    onClose: () => void;
}

export default function EndringsloggSanity(props: EndringsProps) {
    const [endringsloggApen, setEndringsloggApen] = useState(false);
    const overordnetNotifikasjon = props.innhold.some(element => !element.sett);

    const loggNode = useRef<HTMLDivElement>(null); // Referranse til omsluttende div rundt loggen
    const buttonRef = useRef<HTMLButtonElement>(null);

    const requestSetOpenStatus = (setOpenTo: boolean) => {
        if (setOpenTo) {
            props.onOpen();
        } else {
            props.onClose();
        }
        setEndringsloggApen(setOpenTo);
    };

    const handleClickOutside = e => {
        if (loggNode.current && loggNode.current.contains(e.target)) {
            // Klikket er inne i komponenten
            return;
        }
        // Klikket er utenfor, oppdater staten
        if (endringsloggApen) {
            requestSetOpenStatus(false);
        }
    };

    const escHandler = event => {
        if (event.keyCode === 27 && endringsloggApen) {
            requestSetOpenStatus(false);
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
        }
    };

    const klikk = event => {
        event.stopPropagation();
        requestSetOpenStatus(!endringsloggApen);
        if (!endringsloggApen) {
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
        }
    };

    useEventListener('mousedown', handleClickOutside);
    useEventListener('keydown', escHandler);

    return (
        <div ref={loggNode} className="endringslogg">
            <EndringsloggKnapp
                klikk={klikk}
                open={endringsloggApen}
                nyeNotifikasjoner={overordnetNotifikasjon}
                buttonRef={buttonRef}
            />
            <TransitionContainer visible={endringsloggApen}>
                <Undertittel className="collapse-header" tag="h2">
                    Nytt i Arbeidsrettet oppfølging
                </Undertittel>
                <div className={'innhold-container'} data-testid="endringslogg-innhold">
                    <EndringsloggForside endringsloggmeldinger={props.innhold} />
                </div>
            </TransitionContainer>
        </div>
    );
}

interface EndringsloggKnappProps {
    buttonRef: RefObject<HTMLButtonElement>;
    open: boolean;
    nyeNotifikasjoner: boolean;
    klikk: (e?: any) => void;
}

function EndringsloggKnapp(props: EndringsloggKnappProps) {
    return (
        <button
            ref={props.buttonRef}
            className={`endringslogg-knapp endringslogg-dropDown ${props.open && 'endringslogg-dropDown-active'}`}
            onClick={props.klikk}
            data-testid="endringslogg-knapp"
        >
            <AlarmIcon />
            {props.nyeNotifikasjoner && (
                <div className="ring-container">
                    <div className="ringring" />
                    <div className="circle" data-testid="endringslogg_nye-notifikasjoner" />
                </div>
            )}
        </button>
    );
}
