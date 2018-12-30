import {} from './registerReducer';

import { messagesReducer, updateMessageReducer } from './messageReducer';
import { setUserIdReducer, isLoginSuccessfullReducer } from './userReducer';

import {
    SET_USER_ID,
    USER_LOGIN,
    FAILED,
    SUCCESS,
    LOADING,
    LOGOUT,
    USERS,
    SELECT_USERS,
} from '../actions/userActions';

import {
    setInfoMessage,
    resetInfoMessage,
    setIsSuccess,
    setIsAuthenticated,
    setIsLoading,
} from './helperReducer';

import {
    UPDATE_MESSAGE,
    ADD_MESSAGE,
    ADD_RESPONSE,
    LOAD_HISTORY,
} from '../actions/messageActions';

import {
    SHOW_INFO_MESSAGE,
    RESET_INFO_MESSAGE,
    IS_SUCCESS,
    IS_AUTHENTICATED,
    IS_LOADING,
} from '../actions/helperAction';

import {
    CHANGE_ROOM,
    CREATE_CHATROOM,
    CREATE_USERCHAT,
    DELETE_CHATROOM,
} from '../actions/chatroomActions';

import initialState from '../store/';
import {
    deleteChatroomReducer,
    createChatroomReducer,
    createUserChatReducer,
} from './chatroomReducer';

/**
 * This is the main reducer. delegates the work to the specialized sub-reducer.
 */
export default function(state = initialState, action) {
    switch (action.type) {
        case IS_AUTHENTICATED:
            return setIsAuthenticated(state, action);

        case IS_LOADING:
            return setIsLoading(state, action);

        case USER_LOGIN:
            return isLoginSuccessfullReducer(state, action);

        case LOGOUT:
            return { ...initialState, user: { userId: state.user.userId } };

        case ADD_MESSAGE:
            return messagesReducer(state, action);

        case ADD_RESPONSE:
            return messagesReducer(state, action);

        case UPDATE_MESSAGE:
            return updateMessageReducer(state, action);

        case SET_USER_ID:
            return setUserIdReducer(state, action);

        case SHOW_INFO_MESSAGE:
            return setInfoMessage(state, action);

        case RESET_INFO_MESSAGE:
            return resetInfoMessage(state, action);

        case CHANGE_ROOM:
            return { ...state, currentChatroom: action.currentChatroom };

        case CREATE_CHATROOM:
            return createChatroomReducer(state, action);
        case CREATE_USERCHAT:
            return createUserChatReducer(state, action);

        case DELETE_CHATROOM:
            return deleteChatroomReducer(state, action);

        case LOAD_HISTORY:
            return { ...state, messages: action.chats };

        case USERS:
            const users = action.users.filter(
                (user) => user.email !== state.user.email
            );
            const selectedUsers = users.map((user) => user.email);
            return {
                ...state,
                users: users,
                selectedUsers: selectedUsers,
            };
        case SELECT_USERS:
            return { ...state, selectedUsers: action.users };
        case IS_SUCCESS:
            return setIsSuccess(state, action);

        default:
            return { ...state };
    }
}
