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

import React from 'react'
import DropzoneJS from './dropzone'

export default class UploadInputV2 extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        let {value, onRemove, error, ...rest} = this.props;
        let has_error = ( this.props.hasOwnProperty('error') && error !== '' );

        const uploaded = value.filter(v => !v.should_upload);
        const savePending = value.filter(v => v.should_upload);

        return (
            <div className="row">
                <div className="col-md-6"  style={{height: 180}}>
                    <DropzoneJS {...rest} uploadCount={value.length} />
                </div>
                <div className="col-md-6">
                    {has_error &&
                    <p className="error-label">{error}</p>
                    }
                    {uploaded.length > 0 &&
                        <div>
                            <label>Uploaded</label>
                            {uploaded.map((v,i) => {
                                const style = v.should_delete ? {textDecoration: 'line-through'} : {};
                                return (
                                <div key={`uploaded-${i}`}>
                                    <span style={style}>{v.filename}</span>
                                    {!v.should_delete &&
                                        <span> - <a onClick={ev => onRemove(v)}>Remove</a></span>
                                    }
                                    {v.should_delete &&
                                    <span> - save to complete delete </span>
                                    }
                                </div>
                                )
                            })}
                        </div>
                    }
                    {savePending.length > 0 &&
                        <div>
                            <label>Ready to Submit:</label>
                            {savePending.map((v,i) => {
                                return (
                                    <div key={`pending-${i}`}>
                                        <span>{v.filename}</span>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        );
    }
}
