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
import T from 'i18n-react/dist/i18n-react';

export default class CheckboxList extends React.Component {

    constructor(props) {
        super(props);

        let otherValue = props.value.find( v => !props.options.map(op => op.value).includes(v) ) ;

        this.state = {
            otherChecked: !!otherValue
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleOtherCBChange = this.handleOtherCBChange.bind(this);
    }

    handleChange(event) {
        let optionValues = this.props.options.map(op => op.value);
        let value = [...this.props.value];

        if (event.target.type == 'checkbox') {
            if (event.target.checked) {
                value.push(parseInt(event.target.value));
            } else {
                value = value.filter( v => v != event.target.value )
            }
        } else {
            value = value.filter(v => optionValues.includes(v));
            value.push(event.target.value);
        }

        let ev = {target: {
                id: this.props.id,
                value: value,
                type: 'checkboxlist'
            }};

        this.props.onChange(ev);
    }

    handleOtherCBChange(event) {
        this.setState({otherChecked: event.target.checked});
    }

    render() {

        let {onChange, value, className, options, id, children, ...rest} = this.props;
        let { otherChecked } = this.state;

        let inline = ( this.props.hasOwnProperty('inline') );
        let allowOther = ( this.props.hasOwnProperty('allowOther') );
        let otherValue = value.find( v => !options.map(op => op.value).includes(v) ) ;


        let style, label;

        if (inline) {
            style = {
                paddingLeft: '22px',
                marginLeft: '20px',
                float: 'left'
            };


        } else {
            style = {
                paddingLeft: '22px',
                marginTop: '7px'
            }
        }

        return (
            <div className="checkboxes-div">
                { options.map(op => {
                    let checked = value.includes(op.value);
                    return (
                        <div className="form-check abc-checkbox" key={"radio_key_" + op.value} style={style}>
                            <input type="checkbox" id={"cb_" + op.value} checked={checked}
                                   onChange={this.handleChange} className="form-check-input" value={op.value} />
                            <label className="form-check-label" htmlFor={"cb_" + op.value}>
                                {op.label}
                            </label>
                        </div>
                    )
                })}

                {allowOther &&
                <div className="form-check abc-checkbox" style={style}>
                    <input type="checkbox" id={"cb_other" + id} checked={otherChecked}
                           onChange={this.handleOtherCBChange} className="form-check-input" value="other" />
                    <label className="form-check-label" htmlFor={"cb_other" + id}>
                        {T.translate("general.other")}
                    </label>
                </div>
                }

                {allowOther && otherChecked &&
                <div style={{paddingLeft: '22px', width: '50%'}}>
                    <input className="form-control" onChange={this.handleChange} value={otherValue} />
                </div>
                }

            </div>
        );

    }
}