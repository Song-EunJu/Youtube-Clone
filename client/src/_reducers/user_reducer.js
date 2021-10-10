import {
    LOGIN_USER,
    REGISTER_USER
} from '../_actions/types';

export default function (state={}, action){
    switch(action.type){ // 다른 타입이 올 때마다 분기문을 나눠줘야 하기 때문
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload}
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload}
            break;
        default:
            return state;
    }
}