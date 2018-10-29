import * as React from 'react';
import { BrukerModell, EtikettType, VeilederModell } from '../../model-interfaces';
import { FormattedMessage } from 'react-intl';
import { Kolonne } from '../../ducks/ui/listevisning';
import Etikett from './etikett';

interface VeiledernavnProps {
    className?: string;
    bruker: BrukerModell;
    skalVises: boolean;
    veileder?: VeilederModell;
}

function VeilederNavn({ className, bruker, skalVises, veileder }: VeiledernavnProps) {
    if (!skalVises) {
        return null;
    }

    const veilederNavn = <span>{veileder ? `${veileder.etternavn}, ${veileder.fornavn}` : ''}</span>;

    const ufordeltBrukerEtikett = <Etikett
        type={EtikettType.NYBRUKER}
        skalVises={bruker.nyForEnhet === true}
    >
        <FormattedMessage id="enhet.portefolje.tabelletikett.ufordelt.bruker" />
    </Etikett>;

    return (
            <div className={className}>
                { bruker.nyForEnhet === true ? ufordeltBrukerEtikett : veilederNavn }
            </div>
        );
}

export default VeilederNavn;