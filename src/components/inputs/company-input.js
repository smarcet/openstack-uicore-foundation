/**
 * Copyright 2017 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import AsyncSelect from 'react-select/async';
import {queryCompanies} from '../../utils/query-actions';

export default class CompanyInput extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getCompanies = this.getCompanies.bind(this);
    }

    handleChange(value) {
        let ev = {target: {
            id: this.props.id,
            value: value,
            type: 'companyinput'
        }};

        this.props.onChange(ev);
    }

    getCompanies (input, callback) {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        queryCompanies(input, callback);
    }

    render() {
        let {error, value, onChange, id, multi, ...rest} = this.props;
        let has_error = ( this.props.hasOwnProperty('error') && error != '' );
        let isMulti = (this.props.hasOwnProperty('multi'));

        return (
            <div>
                <AsyncSelect
                    value={value}
                    onChange={this.handleChange}
                    loadOptions={this.getCompanies}
                    getOptionValue={option => option.id}
                    getOptionLabel={option => option.name}
                    isMulti={isMulti}
                    {...rest}
                />
                {has_error &&
                <p className="error-label">{error}</p>
                }
            </div>
        );

    }
}

