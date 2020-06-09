import React, { useState } from 'react';
import classNames from 'classnames';
import { Radio } from 'nav-frontend-skjema';
import './radio-filterform.less';
import Grid from '../grid/grid';

export function RadioFilterform({filterId, onSubmit, valg, closeDropdown, filtervalg, columns = 1}) {

    const [valgtFilterValg, setValgteFilterValg] = useState<string>(filtervalg[filterId]);

    const createHandleOnSubmit = () => {
        if (valgtFilterValg) {
            onSubmit(filterId, valgtFilterValg);
        }
        closeDropdown();
    };

    return (
        <form className="skjema radio-filterform" onSubmit={createHandleOnSubmit}>
            <div className="radio-filterform__valg">
                <Grid columns={columns}>
                    {Object.keys(valg).map(v =>
                        <Radio
                            label={valg[v].label}
                            value={v}
                            name={valg[v].label}
                            className={valg[v].className}
                            checked={valgtFilterValg === v}
                            onChange={e => setValgteFilterValg(e.target.value)}
                        />)}
                </Grid>
            </div>
            <div
                className={classNames('radio-filterform__under-valg')}
            >
                <button onClick={createHandleOnSubmit}
                        className={classNames('knapp', 'knapp--mini', {'knapp--hoved': valgtFilterValg})}>
                    {valgtFilterValg ? 'Velg' : 'Lukk'}
                </button>
            </div>
        </form>
    );
}