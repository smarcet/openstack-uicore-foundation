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
import { OptionGroup } from './OptionGroup';
import './optiongroup.less';

export default class GroupedDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value})
        }
    }

    handleChange(ev) {
        this.props.onChange(ev);
    }

    render() {
        let {id, options, placeholder, className, error} = this.props;
        let has_error = ( this.props.hasOwnProperty('error') && error != '' );
        let {value} = this.state;

        return (
            <div>
                <select
                    id={id}
                    className={className + ' form-control ' + (has_error ? 'error' : '')}
                    value={value}
                    onChange={this.handleChange}>
                        <option value="" disabled>{placeholder}</option>
                        {options.map((opt,i) =>
                            {
                                if (typeof opt.options != 'undefined') {
                                    return (
                                        <OptionGroup key={'group_opt_'+i} label={opt.label} value={opt.value} options={opt.options}/>
                                    );
                                } else {
                                    return (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    );
                                }
                            }
                        )}
                </select>
                {has_error &&
                <p className="error-label">{error}</p>
                }
            </div>
        );
    }
}