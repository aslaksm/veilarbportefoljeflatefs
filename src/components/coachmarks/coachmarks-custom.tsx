import {CoachmarksName, StepCoachmarks} from './coachmarks';

const step1: HTMLElement = document.getElementById('filter_tab')!;
const step2: HTMLElement = document.getElementById('sisteEndringKategori-dropdown__innhold')!;
const step3: HTMLElement = document.getElementById('filter_tab')!;

const valgtFilterTab = document.querySelectorAll('button#filter_tab.sidebar__tab.sidebar__tab-valgt')!.length < 1;

console.log("filter?", valgtFilterTab);
const filterTab = valgtFilterTab ? undefined : document.getElementById('filter_tab')!.click();

const stepsSisteEndringer: StepCoachmarks[] = [
    {
        tekst: 'Gå til Filter',
        anker: step1,
        action: {filterTab}
    },
    {
        tekst: 'Gå til Siste endring av bruker',
        anker: step2
    },
    {
        tekst: '',
        anker: step3
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
