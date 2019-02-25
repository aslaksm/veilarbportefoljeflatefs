import React from 'react';
import {Textarea} from "nav-frontend-skjema";
import {Field,getIn} from "formik";

function FormikTekstArea({name}) {

    const validate =  (value:string) => {
        let error: undefined| string;
        if(!value){
            error ='Påkrevd kommentar!';
        }else if(value.length > 500) {
            error = 'Før langttt!!!';}
        return error;
    };

    return (
        <Field validate={validate} name={name}>
            {({field, form}) =>{
                const touched = getIn(form.touched, name);
                const errors = getIn(form.errors, name);
                return (
                    <Textarea
                        id={name}
                        textareaClass="skjemaelement__input input--fullbredde arbeidslistekommentar"
                        label="Kommentar"
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        value={field.value}
                        name={name}
                        feil ={errors && touched ? {feilmelding: errors} : undefined}
                    />)}}
        </Field>
    )
}

export default FormikTekstArea;