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
import URI from "urijs";
import IdTokenVerifier from 'idtoken-verifier';
import {doLogin} from "./actions";
import {getFromLocalStorage, getCurrentPathName, getCurrentHref} from '../../utils/methods';

class AbstractAuthorizationCallbackRoute extends React.Component {

    constructor(issuer, audience, props){
        super(props);
        this.state = {
            id_token_is_valid: true,
            error: null,
            error_description: null,
            issuer: issuer,
            audience: audience
        };
    }

    extractHashParams() {
        return URI.parseQuery(this.props.location.hash.substr(1));
    }

    validateIdToken(idToken){
        let {audience , issuer} = this.state;
        let verifier = new IdTokenVerifier({
            issuer:   issuer,
            audience: audience
        });
        let storedNonce = getFromLocalStorage('nonce', true);
        let jwt    = verifier.decode(idToken);
        let alg    = jwt.header.alg;
        let kid    = jwt.header.kid;
        let aud    = jwt.payload.aud;
        let iss    = jwt.payload.iss;
        let exp    = jwt.payload.exp;
        let nbf    = jwt.payload.nbf;
        let tnonce = jwt.payload.nonce || null;
        return tnonce == storedNonce && aud == audience && iss == issuer;
    }

    componentWillMount() {
        let { access_token , id_token, session_state, error, error_description } = this.extractHashParams();
        if(error){
            // if error condition short cut...
            this.setState({...this.state, error ,error_description});
            return;
        }
        if(!access_token){
            // re start flow
            doLogin(getCurrentPathName());
            return;
        }
        let id_token_is_valid = id_token ? this.validateIdToken(id_token) : false;
        this.setState({...this.state, id_token_is_valid, error ,error_description});
        if(access_token && id_token_is_valid) {
            //console.log(`AuthorizationCallbackRoute::componentWillMount onUserAuth new access token ${access_token}`);
            //console.log(`AuthorizationCallbackRoute::componentWillMount onUserAuth new id token ${id_token}`);
            //console.log(`AuthorizationCallbackRoute::componentWillMount onUserAuth new session state ${session_state}`);
            this.props.onUserAuth(access_token, id_token, session_state);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        //console.log("AuthorizationCallbackRoute::shouldComponentUpdate");
        if(nextProps.accessToken !== this.props.accessToken){
            //console.log("AuthorizationCallbackRoute::shouldComponentUpdate true");
            return true;
        }
        //console.log("AuthorizationCallbackRoute::shouldComponentUpdate false");
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if we have an access token refresh ...
        //console.log("AuthorizationCallbackRoute::componentDidUpdate");
        if(prevProps.accessToken !== this.props.accessToken){
            //console.log("AuthorizationCallbackRoute::componentDidUpdate accessToken changed!");
            let url = URI(getCurrentHref());
            let query = url.search(true);
            let fragment = URI.parseQuery(url.fragment());

            // purge fragment
            delete fragment['access_token'];
            delete fragment['expires_in'];
            delete fragment['token_type'];
            delete fragment['scope'];
            delete fragment['id_token'];
            delete fragment['session_state'];

            let backUrl = query.hasOwnProperty('BackUrl') ? query['BackUrl'] : '/app';

            if (fragment.lenght > 0) {
                backUrl += `#${URI.buildQuery(fragment)}`;
            }
            this._callback(backUrl);
        }
    }

    /**
     * Abstract
     * @param error
     * @private
     */
    _callback(backUrl){}

    /**
     * Abstract
     * @param error
     * @private
     */
    _redirect2Error(error){
    }

    render() {
        //console.log("AuthorizationCallbackRoute::render");
        let {id_token_is_valid, error, error_description } = this.state;

        if(error != null){
           return this._redirect2Error(error);
        }

        if(!id_token_is_valid)
        {
            return this._redirect2Error("token_validation_error");
        }

        return null;
    }
}

export default AbstractAuthorizationCallbackRoute;

