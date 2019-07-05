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
import Dropzone from 'react-dropzone';
import T from 'i18n-react/dist/i18n-react';
import './upload.less';
import file_icon from './file.png';
import pdf_icon from './pdf.png';

export default class UploadInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show_remove: false
        }
    }

    onImageDrop(files) {
        this.props.handleUpload(files[0]);
    }

    showVeil() {
        this.setState({show_remove:true});
    }

    hideVeil() {
        this.setState({show_remove:false});
    }

    render() {
        let {value, file, handleRemove, handleUpload, ...rest} = this.props;
        let icon = '';
        let name = '';

        if (value) {
            icon = (value.endsWith('jpg') || value.endsWith('png')) ? value : (value.endsWith('pdf') ? pdf_icon: file_icon);
            name = value.slice(value.lastIndexOf("/") + 1);
        }

        if (file && file.name) {
            name = file.name;
            icon = (name.endsWith('jpg') || name.endsWith('png')) ? value : (name.endsWith('pdf') ? pdf_icon: file_icon);
        }

        return (
            <div className="file-upload">
                <Dropzone
                    onDrop={this.onImageDrop.bind(this)}
                    {...rest}
                >
                    <div>{T.translate("general.drop_files")}</div>
                </Dropzone>
                <div className="selected-files-box col-md-6">
                    <p>Selected Files</p>
                    <div className="selected-files">
                        {value &&
                        <div className="file-box" onMouseEnter={this.showVeil.bind(this)} onMouseLeave={this.hideVeil.bind(this)}>
                            <img src={icon} />
                            <a href={value} target="_blank">{name}</a>
                            {this.state.show_remove &&
                            <div className="remove" onClick={handleRemove}>
                                <i className="fa fa-times"></i>
                            </div>
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
