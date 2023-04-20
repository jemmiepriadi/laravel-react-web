import {combineReducers} from 'redux'
import notifReducer from './notif'
import authReducer from './auth'

export default combineReducers({
    auth: authReducer,
    notif: notifReducer,
})