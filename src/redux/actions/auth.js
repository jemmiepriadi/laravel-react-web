import Cookies from 'js-cookie'

export function attemptLogout(){
    return dispatch => {
        Cookies.remove('auth_token')
        dispatch(setUser({user: null}))
    }
}

export function setUser({user}){
    return {type: "AUTH_SET_USER", payload: {user}}
}