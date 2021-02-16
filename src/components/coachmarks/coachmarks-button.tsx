import {default as React, useState} from 'react';
import {Knapp} from 'nav-frontend-knapper';
import classNames from 'classnames';
import Coachmarks, {CoachmarksName} from './coachmarks';
import {logEvent} from '../../utils/frontend-logger';

interface CoachmarksStepperProps {
    coachmarks: CoachmarksName;
    knappeTekst?: string;
    className?: string;
}

export default function CoachmarksButton(props: CoachmarksStepperProps) {
    const [open, setOpen] = useState(false);
    const htmlElem: HTMLElement = document.getElementById('filter_tab')!;

    return (
        <>
            <Knapp
                className={classNames('endringslogg-stepperKnapp', props.className)}
                mini
                data-testid="endringslogg_se-hvordan-knapp_coachmarks"
                onClick={() => {
                    setOpen(true);
                    logEvent('portefolje.endringslogg_stepper_coachmarks', {coachmark: props.coachmarks});
                }}
            >
                {props.knappeTekst ? props.knappeTekst : 'Se hvordan'}
            </Knapp>

            <Coachmarks
                hidden={!open}
                ankerEl={open ? htmlElem : undefined}
                coachmarksname={props.coachmarks}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
}
