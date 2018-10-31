/**
 * Copyright 2018 OpenStack Foundation
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
import {getLanguageList} from '../../utils/query-actions';

export default class LanguageInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.abortController = new AbortController();
    }

    componentWillMount () {
        let {options} = this.state;

        if(options.length == 0){
            getLanguageList(this.setOptions, this.abortController.signal);
        }
    }

    componentWillUnmount(){
        this.abortController.abort();
    }

    setOptions(response) {
        this.setState({options: response});
    }

    handleChange(value) {

        let ev = {target: {
                id: this.props.id,
                value: value,
                type: 'laguageinput'
            }};

        this.props.onChange(ev);
    }

    render() {
        let {value, onChange, id, ...rest} = this.props;
        let {options} = this.state;

        return (
            <Select
                onChange={this.handleChange}
                options={options}
                backspaceRemoves={true}
                value={value}
                valueKey="id"
                labelKey="name"
                {...rest}
            />
        );

    }
}
