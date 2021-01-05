import {
    base64URLEncode,
    getAuthCallback,
    getCurrentLocation,
    getCurrentPathName,
    getFromLocalStorage,
    removeFromLocalStorage,
    getOrigin,
    putOnLocalStorage,
    retryPromise,
    setSessionClearingState,
    sha256
} from "../../utils/methods";

import {randomBytes} from "crypto";
import Lock from 'browser-tabs-lock';

/**
 * @ignore
 */
const lock = new Lock();

const GET_TOKEN_SILENTLY_LOCK_KEY = 'openstackuicore.lock.getTokenSilently';
const NONCE_LEN = 16;
export const ACCESS_TOKEN_SKEW_TIME = 20;
export const RESPONSE_TYPE_IMPLICIT = "token id_token";
export const RESPONSE_TYPE_CODE = 'code';

import URI from "urijs";

export const getAuthUrl = (backUrl = null, prompt = null, tokenIdHint = null) => {

    let oauth2ClientId = getOAuth2ClientId();
    let redirectUri = getAuthCallback();
    let baseUrl = getOAuth2IDPBaseUrl();
    let scopes = getOAuth2Scopes();
    let flow = getOAuth2Flow();

    if (backUrl != null)
        redirectUri += `?BackUrl=${encodeURI(backUrl)}`;

    let nonce = createNonce(NONCE_LEN);

    // store nonce to check it later
    putOnLocalStorage('nonce', nonce);
    let url = URI(`${baseUrl}/oauth2/auth`);

    let query = {
        "response_type": encodeURI(flow),
        "scope": encodeURI(scopes),
        "nonce": nonce,
        "response_mode" : 'fragment',
        "client_id": encodeURI(oauth2ClientId),
        "redirect_uri": encodeURI(redirectUri)
    };

    if(flow === RESPONSE_TYPE_CODE){
        const pkce = createPKCECodes()
        putOnLocalStorage('pkce', JSON.stringify(pkce));
        query['code_challenge'] = pkce.codeChallenge;
        query['code_challenge_method'] = 'S256';
        query['access_type'] = 'offline';
        query['approval_prompt'] = 'force';
    }

    if (prompt) {
        query['prompt'] = prompt;
    }

    if (tokenIdHint) {
        query['id_token_hint'] = tokenIdHint;
    }

    url = url.query(query);
    //console.log(`getAuthUrl ${url.toString()}`);
    return url;
}

export const getLogoutUrl = (idToken) => {
    let baseUrl = getOAuth2IDPBaseUrl();
    let oauth2ClientId = getOAuth2ClientId();
    let url = URI(`${baseUrl}/oauth2/end-session`);
    let state = createNonce(NONCE_LEN);
    let postLogOutUri = getOrigin() + '/auth/logout';
    // store nonce to check it later
    putOnLocalStorage('post_logout_state', state);
    /**
     * post_logout_redirect_uri should be listed on oauth2 client settings
     * on IDP
     * "Security Settings" Tab -> Logout Options -> Post Logout Uris
     */
    return url.query({
        "id_token_hint": idToken,
        "post_logout_redirect_uri": encodeURI(postLogOutUri),
        "client_id": encodeURI(oauth2ClientId),
        "state": state,
    });
}

const createNonce = (len) => {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = '';
    for (let i = 0; i < len; i++) {
        nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return nonce;
}

export const doLogin = (backUrl = null) => {
    if (backUrl)
        console.log(`doLogin - backUrl ${backUrl} `);
    let url = getAuthUrl(backUrl);
    let location = getCurrentLocation()
    location.replace(url.toString());
}

const createPKCECodes = () => {
    const codeVerifier = base64URLEncode(randomBytes(64))
    const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)))
    const createdAt = new Date()
    const codePair = {
        codeVerifier,
        codeChallenge,
        createdAt
    }
    return codePair
}

export const emitAccessToken = async (code, backUrl = null) => {

    let baseUrl = getOAuth2IDPBaseUrl();
    let oauth2ClientId = getOAuth2ClientId();
    let redirectUri = getAuthCallback();
    let pkce = JSON.parse(getFromLocalStorage('pkce', true));

    if (backUrl != null)
        redirectUri += `?BackUrl=${encodeURI(backUrl)}`;

    const payload = {
        'code' :  code,
        'grant_type' : 'authorization_code',
        'code_verifier' : pkce.codeVerifier,
        "client_id": encodeURI(oauth2ClientId),
        "redirect_uri": encodeURI(redirectUri)
    };

    try {
        //const response = await http.post(`${baseUrl}/oauth2/token`, payload);
        //const {body: {access_token, refresh_token, id_token, expires_in}} = response;
        const response = await fetch(`${baseUrl}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).catch(function(error) {
            console.log('Request failed:', error.message);
        });
        const json = await response.json();
        let {access_token, refresh_token, id_token, expires_in, error, error_description} = json;
        return {access_token, refresh_token, id_token, expires_in, error, error_description}
    } catch (err) {
        console.log(err);
    }
};

export const getAccessToken = async () => {

    if (
        await retryPromise(
            () => lock.acquireLock(GET_TOKEN_SILENTLY_LOCK_KEY, 5000),
            10
        )
    ) {
        try {

            let {accessToken, expiresIn, accessTokenUpdatedAt, refreshToken} = getAuthInfo();
            let flow = getOAuth2Flow();
            // check life time
            let now = Math.floor(Date.now() / 1000);
            let timeElapsedSecs = (now - accessTokenUpdatedAt);
            expiresIn = (expiresIn - ACCESS_TOKEN_SKEW_TIME);
            //console.log(`getAccessToken now ${now} accessTokenUpdatedAt ${accessTokenUpdatedAt} timeElapsedSecs ${timeElapsedSecs} expiresIn ${expiresIn}.`);

            if (timeElapsedSecs > expiresIn && flow === RESPONSE_TYPE_CODE) {
                //console.log('getAccessToken getting new access token, access token got void');
                if(!refreshToken){
                    throw Error("Refresh token is null.");
                }
                let response = await refreshAccessToken(refreshToken);
                let {access_token, expires_in, refresh_token} = response;
                //console.log(`getAccessToken access_token ${access_token} expires_in ${expires_in} refresh_token ${refresh_token}`);
                if (typeof refresh_token === 'undefined') {
                    refresh_token = null; // not using rotate policy
                }
                storeAuthInfo(access_token, expires_in, refresh_token);
                //console.log(`getAccessToken access_token ${access_token} [NEW]`);
                return access_token;
            }
            //console.log(`getAccessToken access_token ${accessToken} [CACHED]`);
            return accessToken;
        }
        finally {
            await lock.releaseLock(GET_TOKEN_SILENTLY_LOCK_KEY);
        }
    }
    throw Error("Lock acquire error.");
}

export const refreshAccessToken = async (refresh_token) => {

    let baseUrl = getOAuth2IDPBaseUrl();
    let oauth2ClientId = getOAuth2ClientId();

    const payload = {
        'grant_type' : 'refresh_token',
        "client_id": encodeURI(oauth2ClientId),
        "refresh_token": refresh_token
    };

    try {
        const response = await fetch(`${baseUrl}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((response) => {
            if (response.status === 400){
                let currentLocation = getCurrentPathName();
                setSessionClearingState(true);
                //console.log('refreshAccessToken 400 - re login....');
                doLogin(currentLocation);
                throw Error(response.statusText);
            }
            return response;

        }).catch(function(error) {
            console.log('Request failed:', error.message);
        });

        const json = await response.json();
        let {access_token, refresh_token, expires_in} = json;
        return {access_token, refresh_token, expires_in}
    } catch (err) {
        console.log(err);
    }
}

export const storeAuthInfo = (accessToken, expiresIn, refreshToken = null, idToken = null) => {

    let formerAuthInfo = getAuthInfo();

    let authInfo = {
        accessToken : accessToken,
        expiresIn: expiresIn,
        accessTokenUpdatedAt : Math.floor(Date.now() / 1000),
    };

    if(refreshToken === null && formerAuthInfo){
        refreshToken = formerAuthInfo.refreshToken;
    }

    if(idToken === null && formerAuthInfo){
        idToken = formerAuthInfo.idToken;
    }

    if(refreshToken){
        authInfo['refreshToken'] = refreshToken;
    }

    if(idToken){
        authInfo['idToken'] = idToken;
    }

    putOnLocalStorage('authInfo', JSON.stringify(authInfo));
}

export const getAuthInfo = () => {
    let res = getFromLocalStorage('authInfo', false)
    if(res === null) return null;
    return JSON.parse(res);
}

export const clearAuthInfo = () => {
    if(typeof window !== 'undefined'){
        removeFromLocalStorage('authInfo');
        removeFromLocalStorage('nonce');
        removeFromLocalStorage('pkce');
        return;
    }
};

export const getIdToken = () => {
    if(typeof window !== 'undefined') {
        const authInfo = getAuthInfo();
        if(authInfo){
            return authInfo.idToken;
        }
        return null;
    }
    return null;
};

export const getOAuth2ClientId = () => {
    if(typeof window !== 'undefined') {
        return window.OAUTH2_CLIENT_ID;
    }
    return null;
};

export const getOAuth2Flow = () => {
    if(typeof window !== 'undefined') {
        return window.OAUTH2_FLOW || "token id_token";
    }
    return "token id_token";
}

export const getOAuth2IDPBaseUrl = () => {
    if(typeof window !== 'undefined') {
        return window.IDP_BASE_URL;
    }
    return null;
};

export const getOAuth2Scopes = () => {
    if(typeof window !== 'undefined') {
        return window.SCOPES;
    }
    return null;
};

export const initLogOut = () => {
    let location = getCurrentLocation();
    location.replace(getLogoutUrl(getIdToken()).toString());
}