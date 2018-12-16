import request from 'superagent';
import { HOST } from '../config/';
import {
    showPopup,
    isLoading,
    isSuccess,
    isAuthenticated,
} from './helperAction';
import { signHeader } from '../helper/auth';

const loginEndpoint = HOST + 'user/login';
const chatroomEndpoint = HOST + 'chatroom';
const userEndpoint = HOST + 'user';

export const USER_LOGIN = 'user-login';

// these should be generic for all request actions
export const FAILED = 'failed';
export const SET_USER_ID = 'set-user-id';
export const LOGOUT = 'logout';
export const USERS = 'users';
export const SELECT_USERS = 'select_users';

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
    };
}

export function getUsers(token) {
    return (dispatch) => {
        request
            .get(userEndpoint)
            .set(signHeader(token))
            .then((result) => {
                dispatch(loadUsers(result.body));
            })
            .catch((err) => {});
    };
}

/**
 * logs in a user. on success redirect to chat.
 * on fail show an error message.
 *
 * @param {Object} user the user that tries to login
 */
export function login({ email, password }) {
    return (dispatch) => {
        dispatch(isLoading(true));

        const requests = [];
        requests.push(
            request
                .post(loginEndpoint)
                .set('Content-Type', 'application/json')
                .send({ email, password })
                .catch((err) => {
                    dispatch(showPopup('Error while login: ' + err.message));
                    dispatch(isSuccess(false));
                    dispatch(isLoading(false));
                })
        );
        requests.push(
            request
                .get(chatroomEndpoint)
                .set({ 'Content-Type': 'application/json' })
        );

        Promise.all(requests).then((result) => {
            const loginResult = result[0].body;
            const chatroomResult = result[1].body;
            dispatch(
                userLogin({
                    user: loginResult.user,
                    accessToken: loginResult.token,
                    chatrooms: chatroomResult.chatrooms,
                })
            );
            dispatch(isSuccess(true));
            dispatch(isAuthenticated(true));
            dispatch(showPopup(loginResult.message)); // show the popup for default seconds
            dispatch(isLoading(false));
        });
    };
}

export function logout() {
    return {
        type: LOGOUT,
    };
}

function loadUsers(users) {
    return {
        type: USERS,
        users: users,
    };
}

export function selectUsers(users) {
    return {
        type: SELECT_USERS,
        users: users,
    };
}

export function userLogin({ user, accessToken, chatrooms }) {
    return {
        type: USER_LOGIN,
        user,
        accessToken,
        chatrooms,
    };
}
