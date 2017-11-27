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
import request from 'superagent';
import URI from "urijs";
let http = request;
import 'sweetalert2/dist/sweetalert2.css';
import swal from 'sweetalert2';

export const defaultErrorHandler = (err, res) => (dispatch) => {
    let text = res.body;
    if(res.body != null && res.body.messages instanceof Array) {
        let messages = res.body.messages.map( m => {
            if (m instanceof Object) return m.message
    else return m;
    })
        text = messages.join('\n');
    }
    swal(res.statusText, text, "error");
}

export const GENERIC_ERROR = "Yikes. Something seems to be broken. Our web team has been notified, and we apologize for the inconvenience.";
export const START_LOADING = 'START_LOADING';
export const STOP_LOADING  = 'STOP_LOADING';

export const createAction = type => payload => ({
    type,
    payload
});

export const startLoading = createAction(START_LOADING);
export const stopLoading  = createAction(STOP_LOADING);


const xhrs = {};

const cancel = (key) => {
    if(xhrs[key]) {
        xhrs[key].abort();
        console.log(`aborted request ${key}`);
        delete xhrs[key];
    }
}

const schedule = (key, req) => {
    console.log(`scheduling ${key}`);
    xhrs[key] = req;
};

const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object ;
}

export const getRequest =(
    requestActionCreator,
    receiveActionCreator,
    endpoint,
    errorHandler = defaultErrorHandler
) => (params = {}) => dispatch => {

    let url = URI(endpoint);

    if(!isObjectEmpty(params))
        url = url.query(params);

    if(requestActionCreator && typeof requestActionCreator === 'function')
        dispatch(requestActionCreator(params));

    const key = `${requestActionCreator().type}_${JSON.stringify(params || {})}`;
    cancel(key);

    return new Promise((resolve, reject) => {
        http.get(url.toString())
        .timeout({
            response: 60000,
            deadline: 60000,
        })
        .end(
            responseHandler(
                dispatch,
                json => {
                    if(typeof receiveActionCreator === 'function') {
                        dispatch(receiveActionCreator({
                            response: json
                        }));
                        return resolve();
                    }
                    dispatch(receiveActionCreator);
                    return resolve();
                },
                errorHandler
            )
        )
    });
};

export const putRequest = (
    requestActionCreator,
    receiveActionCreator,
    endpoint,
    payload,
    errorHandler = defaultErrorHandler
) => (params = {}) => dispatch => {

    let url = URI(endpoint);

    if(!isObjectEmpty(params))
        url = url.query(params);

    if(requestActionCreator && typeof requestActionCreator === 'function')
        dispatch(requestActionCreator(params));

    return new Promise((resolve, reject) => {
        http.put(url.toString())
        .timeout({
            response: 60000,
            deadline: 60000,
        })
        .send(payload)
        .end(
            responseHandler(
                dispatch,
                json => {
                    if(typeof receiveActionCreator === 'function') {
                        dispatch(receiveActionCreator({response: json}));
                        return resolve();
                    }
                    dispatch(receiveActionCreator);
                    return resolve();
                },
                errorHandler
            )
        )
    });
};

export const deleteRequest = (
    requestActionCreator,
    receiveActionCreator,
    endpoint,
    payload,
    errorHandler  = defaultErrorHandler
) => (params) => (dispatch) => {
    let url = URI(endpoint).toString();

    if(requestActionCreator && typeof requestActionCreator === 'function')
        dispatch(requestActionCreator(params));

    return new Promise((resolve, reject) => {
        http.delete(url)
        .send(payload)
        .end(
            responseHandler(
                dispatch,
                json => {
                    if (typeof receiveActionCreator === 'function') {
                        dispatch(receiveActionCreator({response: json}));
                        return resolve();
                    }
                    dispatch(receiveActionCreator);
                    return resolve();
                },
                errorHandler
            )
        )
    });
};

export const postRequest = (
        requestActionCreator,
        receiveActionCreator,
        endpoint,
        payload,
        errorHandler = defaultErrorHandler
) => (params = {}) => dispatch => {

    let url = URI(endpoint);

    if(!isObjectEmpty(params))
        url = url.query(params);

    if(requestActionCreator && typeof requestActionCreator === 'function')
        dispatch(requestActionCreator(params));
    return new Promise((resolve, reject) => {
        http.post(url)
            .send(payload)
            .end(
                responseHandler(
                    dispatch,
                    json => {
                        if(typeof receiveActionCreator === 'function') {
                            dispatch(receiveActionCreator({response: json}));
                            return resolve();
                        }
                        dispatch(receiveActionCreator);
                        return resolve();
                    },
                    errorHandler
                )
            )
    });

};

export const responseHandler = (dispatch, success, errorHandler) => {
    return (err, res) => {
        if (err || !res.ok) {
            if(errorHandler) {
                errorHandler(err, res)(dispatch);
            }
            console.log(err, res);
        }
        else if(typeof success === 'function') {
            success(res.body);
        }
    };
};