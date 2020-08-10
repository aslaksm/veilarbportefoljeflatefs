import {initialState} from '../ducks/filtrering';
import * as faker from 'faker/locale/nb_NO';
import {LagretFilter} from "../ducks/lagret-filter";

export const lagredeFilter = () => {
    return (
        [
            {
                filterNavn: 'Unge arbeidsledige møter idag',
                filterId: 1,
                filterValg: {...initialState, alder: ["20-24"], ferdigfilterListe: ["MOTER_IDAG"]},
                opprettetDato: faker.date.between(new Date('2015-01-01'), new Date()),
            },
            {
                filterNavn: 'Spesiell tilpasset innsats',
                filterId: 2,
                filterValg: {...initialState, innsatsgruppe: ["BATT"], formidlingsgruppe: ["ARBS"]},
                opprettetDato: faker.date.between(new Date('2015-01-01'), new Date()),
            }
        ] as LagretFilter []
    );
};