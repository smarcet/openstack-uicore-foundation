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
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import {querySpeakers} from '../../utils/query-actions';

export default class SpeakerInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
        this.getSpeakers = this.getSpeakers.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.filterOptions = this.filterOptions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.hasOwnProperty('value') && this.state.value != nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    handleChange(value) {
        let ev = {target: {
            id: this.props.id,
            value: value,
            type: 'speakerinput'
        }};

        this.props.onChange(ev);
    }

    handleClick(value) {
        let {history, summitId} = this.props;

        history.push(`/app/speakers/${value.id}`);
    }

    filterOptions(options, filterString, values) {
        if (this.props.multi) {
            let filtered_options = options.filter( op => {
                return values.map(val => val.id).indexOf( op.id ) < 0;
            } );

            return filtered_options;
        } else {
            return options;
        }
    }

    getSpeakers (input, callback) {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        let summitId = (this.props.hasOwnProperty('queryAll')) ? null : this.props.summitId;

        querySpeakers(summitId, input, callback);
    }



    render() {
        let {value, onChange, history, summitId, error, id, ...rest} = this.props;
        let has_error = ( this.props.hasOwnProperty('error') && error != '' );

        return (
            <div>
                <Select.Async
                    value={this.state.value}
                    onChange={this.handleChange}
                    loadOptions={this.getSpeakers}
                    onValueClick={this.handleClick}
                    backspaceRemoves={true}
                    valueKey="id"
                    optionRenderer={(op) => (`${op.first_name} ${op.last_name} (${op.id})`)}
                    valueRenderer={(op) => (`${op.first_name} ${op.last_name} (${op.id})`)}
                    filterOptions={this.filterOptions}
                    {...rest}
                />
                {has_error &&
                <p className="error-label">{error}</p>
                }
            </div>
        );

    }
}

