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
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';
import './simple-link-list.less';
import Select from 'react-select';
import Table from "../table/Table";
import T from 'i18n-react/dist/i18n-react';


class SimpleLinkList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.filterOptions = this.filterOptions.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.handleLink = this.handleLink.bind(this);
    }

    filterOptions(options, filterString, values) {
        return options.filter( op => {
            return this.props.values.map(val => val.id).indexOf( op.id ) < 0;
        } );
    }

    getOptions(input, callback) {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        this.props.options.actions.search(input, callback);
    }

    handleChange(value) {
        this.setState({value});
    }

    handleLink(ev) {
        ev.preventDefault();
        this.props.options.actions.add.onClick(this.state.value);
        this.setState({value: ''});
    }


    render() {

        let {options, values, columns} = this.props;
        let disabledAdd = (!this.state.value);

        let title = options.hasOwnProperty('title') ? options.title : 'Table';

        let tableOptions = {
            className: 'dataTable',
            actions: {
                delete: options.actions.delete
            }
        };

        if (options.hasOwnProperty('className')) {
            tableOptions.className = options.className;
        }

        if (options.actions.hasOwnProperty('edit')) {
            tableOptions.actions.edit = options.actions.edit;
        }

        if (options.actions.hasOwnProperty('custom')) {
            tableOptions.actions.custom = options.actions.custom;
        }

        if (options.hasOwnProperty('sortCol')) {
            values = values.sort(
                (a, b) => (a[options.sortCol] > b[options.sortCol] ? 1 : (a[options.sortCol] < b[options.sortCol] ? -1 : 0))
            );
        }


        return (
            <div className="row simple-link-list">
                <div className="col-md-4 simple-link-list-title">
                    <h4>{title}</h4>
                </div>
                <div className="col-md pull-right btn-group">
                    <Select.Async
                        className="link-select btn-group text-left"
                        value={this.state.value}
                        valueKey={options.valueKey}
                        labelKey={options.labelKey}
                        onChange={this.handleChange}
                        loadOptions={this.getOptions}
                        filterOptions={this.filterOptions}
                    />
                    <button type="button" className="btn btn-default" onClick={this.handleLink} disabled={disabledAdd}>
                        {T.translate("general.add")}
                    </button>
                </div>
                <div className="col-md-12">
                    <Table
                        className="dataTable"
                        options={tableOptions}
                        data={values}
                        columns={columns}
                    />
                </div>
            </div>
        );

    }
}

SimpleLinkList.propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.shape({
        title: PropTypes.string,
        sortCol: PropTypes.string,
        valueKey: PropTypes.string.isRequired,
        labelKey: PropTypes.string.isRequired,
        className: PropTypes.string,
        actions: PropTypes.shape({
            search: PropTypes.func.isRequired,
            delete: PropTypes.func.isRequired,
            add: PropTypes.func.isRequired,
            edit: PropTypes.func,
            custom: PropTypes.func,
        }).isRequired
    }).isRequired,
    columns: PropTypes.shape({
        columnKey: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired
    }).isRequired
}

export default SimpleLinkList;
