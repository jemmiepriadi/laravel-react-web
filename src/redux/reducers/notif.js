


const initialState = {
    type: null,
    message: null,
    counter: 0
}

export default (state = initialState, action) => {
    const {type,payload} = action

    switch (type) {
        case  "NOTIF_SET_ALERT":
            if (payload.counter >= state.counter){
                return {...state, type: payload.type, message: payload.message, counter: payload.counter}
            } else {
                return {...state}
            }
        default: {
            return state
        }
    }
}