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

import {
    LOGOUT_USER, SET_LOGGED_USER, RECEIVE_USER_INFO, START_SESSION_STATE_CHECK,
    END_SESSION_STATE_CHECK, CLEAR_SESSION_STATE
} from './actions';
import IdTokenVerifier from 'idtoken-verifier';

import {storeAuthInfo, clearAuthInfo} from '../../utils/methods';

const DEFAULT_STATE = {
    isLoggedUser: false,
    accessToken: null,
    member: null,
    idToken: null,
    sessionState: null,
    backUrl : null,
    checkingSessionState: false,
}

export const loggedUserReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action
    let issuer              = window.IDP_BASE_URL || '';
    let audience            = window.OAUTH2_CLIENT_ID || '';

    switch(type) {
        case SET_LOGGED_USER: {
            let { accessToken, idToken, sessionState } = action.payload;
            storeAuthInfo(accessToken, idToken, sessionState);
            return {...state, isLoggedUser:true, accessToken, idToken, sessionState, backUrl : null };
        }
        case CLEAR_SESSION_STATE:
        {
            clearAuthInfo();
            return {...state, isLoggedUser:false, accessToken:null, idToken:null, sessionState:null, backUrl : null };
        }
        case LOGOUT_USER : {
            clearAuthInfo();
            return {...DEFAULT_STATE, backUrl: payload.backUrl};
        }
        case RECEIVE_USER_INFO: {
            let { response } = action.payload;

            if(issuer != '' && audience != '') {
                // check on idp groups
                let verifier = new IdTokenVerifier({
                    issuer: issuer,
                    audience: audience
                });

                let jwt       = verifier.decode(idToken);
                let idpGroups = jwt.payload.groups || [];
                let address   = jwt.payload.address || {};
                // merge

                idpGroups = idpGroups.map((idpGroup) => { return {
                    id:idpGroup.id,
                    title: idpGroup.name,
                    description:  idpGroup.name,
                    code:idpGroup.slug,
                    created: idpGroup.created_at,
                    last_edited: idpGroup.updated_at
                }});

                response = {...response, groups: [...response.groups, ...idpGroups], address};
            }
            return {...state, member: response};
        }
        case START_SESSION_STATE_CHECK:{
            return {...state, checkingSessionState: true };
        }
        case END_SESSION_STATE_CHECK:{
            return {...state, checkingSessionState: false };
        }
        default:
            return state;
    }

}
