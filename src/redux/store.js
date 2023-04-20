import {createStore, applyMiddleware} from "redux"
import rootReducer from './reducers'
import { createLogger } from 'redux-logger'

import thunk from 'redux-thunk'

const logger = createLogger()

const middlewares = [thunk]

if (process.env.NODE_ENV === 'development'){
    middlewares.unshift(logger)
}

export default createStore(
    rootReducer,
    applyMiddleware(...middlewares)
)