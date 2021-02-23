import {CoachmarksName, StepCoachmarks} from './coachmarks';

const stepsSisteEndringer: StepCoachmarks[] = [
    {
        tekst: 'Gå til Filter',
    },
    {
        tekst: 'Gå til Siste endring av bruker',
    },
    {
        tekst: '',
    }
];

export function getCoachmarks(coachmarks: CoachmarksName) {
    switch (coachmarks) {
        case CoachmarksName.SISTE_ENDRINGER:
            return stepsSisteEndringer;
        default:
            return null;
    }
}
