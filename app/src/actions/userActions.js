import request from 'superagent';
import {HOST} from '../config/';

const loginEndpoint = HOST + 'user/login';
const chatroomEndpoint = HOST + 'chatroom';

export const USER_LOGIN = 'user-login';

// these should be generic for all request actions
export const FAILED = 'failed';
export const SUCCESS = 'success';
export const LOADING = 'laoding';
export const SET_USER_ID = 'set-user-id';
export const LOGOUT = 'logout';

/**
 * Register a new client on the websocket
 *
 * @param {Object} user the user to register
 *
 */
export function setUserId(user) {
    return {
        type: SET_USER_ID,
        user,
    }
}

/**
 * logs in a user. on success redirect to chat.
 * on fail show an error message.
 *
 * @param {Object} user the user that tries to login
 */
export function login({email, password}) {
    return (dispatch) => {
        dispatch(isLoading(true));

        const requests = [];
        requests.push(
            request
            .post(loginEndpoint)
            .set('Content-Type', 'application/json')
            .send({email, password})
        );
        requests.push(
            request
                .get(chatroomEndpoint)
                .set({'Content-Type': 'application/json'})
        );

        Promise.all(requests).then((result) => {
            const loginResult = result[0];
            const chatroomResult = result[1];
            dispatch(hasSucceeded({isSuccess: true, infoMessage: loginResult.body.message, user: loginResult.body.user,
                accessToken: loginResult.body.token, chatrooms: chatroomResult.body.chatrooms}));
            dispatch(isLoading(false));
        })
            .catch((loginError, chatroomError) => {
                console.log(loginError)
                dispatch(hasSucceeded({isSuccess: false, infoMessage: loginError}));
                dispatch(isLoading(false));
            });

        // request
        //     .post(loginEndpoint)
        //     .set('Content-Type', 'application/json')
        //     .send({email, password})
        //     .then( res => {
        //         console.log(res)
        //         dispatch(hasSucceeded({isSuccess: true, infoMessage: res.body.message, user: res.body.user,
        //             accessToken: res.body.token}));
        //         dispatch(isLoading(false));
        //     })
        //     .catch( err => {
        //         console.log(err)
        //         dispatch(hasSucceeded({isSuccess: false, infoMessage: err}));
        //         dispatch(isLoading(false));
        //     });
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}

export function isLoading(bool) {
    return {
        type: LOADING,
        isLoading: bool,
    }
}

export function hasSucceeded({isSuccess, infoMessage, user, accessToken, chatrooms}) {
    return {
        type: SUCCESS,
        infoMessage,
        isSuccess,
        user,
        accessToken,
        chatrooms,
    }
}