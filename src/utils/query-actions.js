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

import {fetchErrorHandler, fetchResponseHandler} from "./actions";
import _ from 'lodash';
export const RECEIVE_COUNTRIES  = 'RECEIVE_COUNTRIES';
const callDelay = 500; //miliseconds


export const queryMembers = _.debounce((input, callback) => {

    let accessToken = window.accessToken;
    input       = encodeURIComponent(input);
    let filters = `first_name=@${input},last_name=@${input},email=@${input}`;
    let expand = `tickets,rsvp,schedule_summit_events,all_affiliations`

    fetch(`${window.API_BASE_URL}/api/v1/members?filter=${filters}&expand=${expand}&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const querySpeakers = _.debounce((summitId, input, callback) => {

    let accessToken = window.accessToken;
    let filters = `first_name=@${input},last_name=@${input},email=@${input}`;
    let apiUrl = `${window.API_BASE_URL}/api/v1`;

    if (summitId) {
        apiUrl += `/summits/${summitId}`;
    }

    apiUrl += `/speakers?filter=${filters}&access_token=${accessToken}`;

    fetch(apiUrl)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryTags = _.debounce((summitId, input, callback) => {

    let accessToken = window.accessToken;
    let apiUrl = `${window.API_BASE_URL}/api/v1`;

    if (summitId) {
        apiUrl += `/summits/${summitId}/track-tag-groups/all/allowed-tags?filter=tag=@${input}&expand=tag,track_tag_group`;
    } else {
        apiUrl += `/tags?filter=tag=@${input}`;
    }

    apiUrl += `&order=tag&page=1&per_page=50&access_token=${accessToken}`;

    fetch(apiUrl)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            if (summitId) {
                options = options.map(t => t.tag);
            }

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryTracks = _.debounce((summitId, input, callback) => {

    let accessToken = window.accessToken;

    fetch(`${window.API_BASE_URL}/api/v1/summits/${summitId}/tracks?filter=name=@${input}&order=name&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryTrackGroups = _.debounce((summitId, input, callback) => {

    let accessToken = window.accessToken;

    fetch(`${window.API_BASE_URL}/api/v1/summits/${summitId}/track-groups?filter=name=@${input}&order=name&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryEvents = _.debounce((summitId, input, onlyPublished = false, callback) => {

    let accessToken = window.accessToken;
    let baseUrl = `${window.API_BASE_URL}/api/v1/summits/${summitId}/events` + (onlyPublished ? '/published' : '');

    fetch(`${baseUrl}?filter=title=@${input}&order=title&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryGroups = _.debounce((input, callback) => {

    let accessToken = window.accessToken;
    let filters = `title=@${input},code=@${input}`;

    fetch(`${window.API_BASE_URL}/api/v1/groups?filter=${filters}&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryCompanies = _.debounce((input, callback) => {

    let accessToken = window.accessToken;
    let filters = `name=@${input}`;

    fetch(`${window.API_BASE_URL}/api/v1/companies?filter=${filters}&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);



export const queryOrganizations = _.debounce((input, callback) => {

    let accessToken = window.accessToken;
    let filters = `name=@${input}`;

    fetch(`${window.API_BASE_URL}/api/v1/organizations?filter=${filters}&access_token=${accessToken}`)
        .then(fetchResponseHandler)
        .then((json) => {
            let options = [...json.data];

            callback(options);
        })
        .catch(fetchErrorHandler);
}, callDelay);


export const getLanguageList = (callback, signal) => {
    let accessToken = window.accessToken;

    return fetch(`${window.API_BASE_URL}/api/public/v1/languages?access_token=${accessToken}`, {signal})
        .then(fetchResponseHandler)
        .then((response) => {
            callback(response.data);
        })
        .catch(fetchErrorHandler);
};


export const getCountryList = (callback, signal) => {
    let accessToken = window.accessToken;

    return fetch(`${window.API_BASE_URL}/api/public/v1/countries?access_token=${accessToken}`, {signal})
        .then(fetchResponseHandler)
        .then((response) => {
            callback(response.data);
        })
        .catch(fetchErrorHandler);
};



var geocoder;

export const geoCodeAddress = (address) => {

    if (!geocoder) geocoder = new google.maps.Geocoder();

    // return a Promise
    return new Promise(function(resolve,reject) {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // resolve results upon a successful status
                resolve(results);
            } else {
                // reject status upon un-successful status
                reject(status);
            }
        });
    });
};

export const geoCodeLatLng = (lat, lng) => {

    if (!geocoder) geocoder = new google.maps.Geocoder();

    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    // return a Promise
    return new Promise(function(resolve,reject) {
        geocoder.geocode( { 'location': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // resolve results upon a successful status
                resolve(results);
            } else {
                // reject status upon un-successful status
                reject(status);
            }
        });
    });
};


