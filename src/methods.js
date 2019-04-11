import React from 'react';
import T from "i18n-react/dist/i18n-react";

import {
    createAction,
    getRequest,
    putRequest,
    deleteRequest,
    postRequest,
    postFile,
    putFile,
    defaultErrorHandler,
    responseHandler,
    fetchErrorHandler,
    fetchResponseHandler,
    showMessage,
    showSuccessMessage,
    getCSV,
    resetLoading,
    startLoading,
    stopLoading,
    authErrorHandler,
} from './utils/actions';

import {
    queryMembers,
    querySpeakers,
    queryTags,
    queryTracks,
    queryTrackGroups,
    queryEvents,
    queryGroups,
    queryCompanies,
    getLanguageList,
    queryOrganizations,
    getCountryList,
    geoCodeAddress,
    geoCodeLatLng
} from './utils/query-actions';

import {
    findElementPos,
    epochToMoment,
    epochToMomentTimeZone,
    formatEpoch,
    objectToQueryString,
    getBackURL
} from './utils/methods'


import {
    getAuthUrl,
    getLogoutUrl,
    doLogin,
    onUserAuth,
    initLogOut,
    doLogout,
    getUserInfo,
    onStartSessionStateCheck,
    onFinishSessionStateCheck,
} from './components/security/actions';

let language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

// language would be something like es-ES or es_ES
// However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits

if (language.length > 2) {
    language = language.split("-")[0];
    language = language.split("_")[0];
}

T.setTexts(require(`./i18n/${language}.json`));


export {
    resetLoading,
    startLoading,
    stopLoading,
    responseHandler,
    fetchErrorHandler,
    fetchResponseHandler,
    showMessage,
    showSuccessMessage,
    getCSV,
    getRequest,
    putRequest,
    deleteRequest,
    postRequest,
    postFile,
    putFile,
    defaultErrorHandler,
    createAction,
    queryMembers,
    querySpeakers,
    queryTags,
    queryTracks,
    queryTrackGroups,
    queryEvents,
    queryGroups,
    queryCompanies,
    getLanguageList,
    queryOrganizations,
    getCountryList,
    geoCodeAddress,
    geoCodeLatLng,
    findElementPos,
    epochToMoment,
    epochToMomentTimeZone,
    formatEpoch,
    objectToQueryString,
    getBackURL,
    getAuthUrl,
    getLogoutUrl,
    doLogin,
    onUserAuth,
    initLogOut,
    doLogout,
    getUserInfo,
    onStartSessionStateCheck,
    onFinishSessionStateCheck,
    authErrorHandler,
};
