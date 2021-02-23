import {default as React, useEffect, useState} from 'react';
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
    // anker: HTMLElement | undefined;
    // action?: void;
}

interface CoachmarksProps {
    coachmarksname: CoachmarksName;
    onClose: (e: boolean) => void;
    open: boolean;
}

function Coachmarks({coachmarksname, onClose, open}: CoachmarksProps) {
    const anker1: HTMLElement = document.getElementById('filter_tab')!;
    const anker2: HTMLElement = document.getElementById('sisteEndringKategori-dropdown__innhold')!;

    // const velgAnker = (): HTMLElement | undefined => {
    //     if (stepIndex === 0) return anker1;
    //     else if (stepIndex === 1) return anker2;
    //     else if (stepIndex === 2) return anker2;
    //     else return undefined;
    // };

    const filterTabErValgt = document.querySelectorAll('button#filter_tab.sidebar__tab.sidebar__tab-valgt')!.length > 1;

    const action1 = () => {
        console.log('valgtfiltertab', filterTabErValgt);
        if (filterTabErValgt) return;
        else return anker1.click();
    };
    //
    // const velgAction = (): void | undefined => {
    //     console.log('stepindex', stepIndex);
    //     if (stepIndex === 1) return action1();
    //     else if (stepIndex === 2) return anker2.click();
    //     else return undefined;
    // };

    const [stepIndex, setStepIndex] = useState(0);

    const lukkModal = () => {
        onClose(isFinalStep);
    };

    const handleNextBtnClicked = () => {
        setStepIndex(stepIndex + 1);

        if(stepIndex === 1) {

        }
    };

    const steps = getCoachmarks(coachmarksname);
    if (!steps) return null;
    const step = steps[stepIndex];
    const isFinalStep = stepIndex === steps.length - 1;

    const nextBtnText = isFinalStep ? 'Ferdig' : 'Neste';
    const nextBtnHandleClick = isFinalStep ? lukkModal : handleNextBtnClicked;

    // console.log('åpen', open);
    console.log('stepIndex', stepIndex);

    return (
        <>
            {stepIndex === 0 && (
                <Popover
                    onRequestClose={() => onClose}
                    orientering={PopoverOrientering.Hoyre}
                    autoFokus
                    ankerEl={anker1}
                >
                    <div className="coachmarks-popover__innhold">
                        <p>Gå til Filter</p>
                        <Knapp
                            mini
                            className="coachmarks-popover__innhold__knapp"
                            onClick={nextBtnHandleClick && action1}
                        >
                            {`${nextBtnText}  ${stepIndex + 1}/${steps.length}`}
                        </Knapp>
                    </div>
                </Popover>
            )}

            {stepIndex === 1 && (
                <Popover
                    onRequestClose={() => onClose}
                    orientering={PopoverOrientering.Hoyre}
                    autoFokus
                    ankerEl={anker2}
                >
                    <div className="coachmarks-popover__innhold">
                        <p>Gå til Siste endring av bruker</p>
                        <Knapp
                            mini
                            className="coachmarks-popover__innhold__knapp"
                            onClick={nextBtnHandleClick && anker2.click}
                        >
                            {`${nextBtnText}  ${stepIndex + 1}/${steps.length}`}
                        </Knapp>
                    </div>
                </Popover>
            )}

            {stepIndex === 2 && (
                <Popover
                    onRequestClose={() => onClose}
                    orientering={PopoverOrientering.Hoyre}
                    autoFokus
                    ankerEl={anker2}
                >
                    <div className="coachmarks-popover__innhold">
                        <p>{step.tekst}</p>
                        <Knapp mini className="coachmarks-popover__innhold__knapp" onClick={nextBtnHandleClick}>
                            {`${nextBtnText}  ${stepIndex + 1}/${steps.length}`}
                        </Knapp>
                    </div>
                </Popover>
            )}
        </>
    );
}
export default hiddenIf(Coachmarks);
