import * as React from 'react';
import FormikDatoVelger from '../../formik/formik-datovelger/formik-datovelger';
import { BrukerModell } from '../../../model-interfaces';
import { Undertittel } from 'nav-frontend-typografi';
import FormikInput from '../../formik/formik-input';
import FormikTekstArea from '../../formik/formik-tekstarea';

function label(bruker: BrukerModell): React.ReactNode {
    return (
        <Undertittel>
            {`${bruker.fornavn} ${bruker.etternavn}, ${bruker.fnr}`}
        </Undertittel>
    );
}

function ArbeidslisteForm({arbeidsliste, valgteBrukere}) {
    return(
        <div>
            {arbeidsliste.map((bruker, index) => (
                <div className="input-fields">
                    <div className="nav-input blokk-s" key={index}>
                        <legend>
                            {label(valgteBrukere[index])}
                        </legend>
                        <FormikInput name={`arbeidsliste[${index}].overskrift`}/>
                        <FormikTekstArea name={`arbeidsliste[${index}].kommentar`}/>
                    </div>
                    <FormikDatoVelger name={`arbeidsliste[${index}].frist`}/>
                </div>
            ))}
        </div>
    );

}

export default ArbeidslisteForm;