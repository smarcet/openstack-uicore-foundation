import React from 'react';
import 'font-awesome/css/font-awesome.css';
import { responseHandler, defaultErrorHandler, createAction, getRequest, putRequest, deleteRequest, postRequest, postFile, putFile, startLoading, stopLoading, START_LOADING, STOP_LOADING } from './utils/actions';
import {AjaxLoader } from './components/ajaxloader';
import { genericReducers } from './utils/reducers';

export {  startLoading, stopLoading, START_LOADING, STOP_LOADING, responseHandler, getRequest, putRequest, deleteRequest, postRequest, defaultErrorHandler, createAction, genericReducers, AjaxLoader};