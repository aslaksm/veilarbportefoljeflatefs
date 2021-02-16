import {default as React, useState} from 'react';
import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import {getCoachmarks} from './coachmarks-custom';
import './coachmarks.less';
import hiddenIf from '../hidden-if/hidden-if';
import {Knapp} from 'nav-frontend-knapper';

export enum CoachmarksName {
    SISTE_ENDRINGER = 'COACHMARKS-SISTE_ENDRINGER'
}

export interface StepCoachmarks {
    tekst: React.ReactNode;
    anker: HTMLElement | undefined;
    action?: any | undefined;
}

interface CoachmarksProps {
    coachmarksname: CoachmarksName;
    onClose: (e: boolean) => void;
    open: boolean;
    ankerEl: HTMLElement | undefined;
}

function Coachmarks({coachmarksname, onClose, open, ankerEl}: CoachmarksProps) {
    const [stepIndex, setStepIndex] = useState(0);

    const lukkModal = () => {
        onClose(isFinalStep);
    };

    const handleNextBtnClicked = () => {
        // if (
        //     stepIndex + 1 === 1 &&
        //     document.querySelectorAll('button#filter_tab.sidebar__tab.sidebar__tab-valgt').length < 1
        // ) {
        //     document.getElementById('filter_tab')!.click();
        // }
        setStepIndex(stepIndex + 1);
        return step.action;
    };

    const steps = getCoachmarks(coachmarksname);
    if (!steps) return null;
    const step = steps[stepIndex];
    const isFinalStep = stepIndex === steps.length - 1;

    // const hidePrevBtn = stepIndex === 0;
    const nextBtnText = isFinalStep ? 'Ferdig' : 'Neste';
    const nextBtnHandleClick = isFinalStep ? lukkModal : handleNextBtnClicked;

    console.log('step', step);
    console.log('action', step.action);
    console.log('anker', step.anker);
    console.log('åpen', open);

    return (
        <Popover
            onRequestClose={() => onClose}
            orientering={PopoverOrientering.Hoyre}
            autoFokus
            // ankerEl={open ? ankerEl : undefined}
            // ankerEl={ankerEl}
            ankerEl={document.getElementById('filter_tab')!}
            // className="coachmarks-popover"
        >
            <div className="coachmarks-popover__innhold">
                <p>{step.tekst}</p>
                <Knapp mini className="coachmarks-popover__innhold__knapp" onClick={nextBtnHandleClick}>
                    {`${nextBtnText}  ${stepIndex + 1}/${steps.length}`}
                </Knapp>
            </div>
        </Popover>
    );
}
export default hiddenIf(Coachmarks);
