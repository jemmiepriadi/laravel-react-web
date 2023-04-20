
const initialState = {
    user: null
}

export default (state = initialState, action) => {
    const {type,payload} = action

    switch (type) {
        case "AUTH_SET_USER":
            return {...state, user: payload.user}
        default: {
            return state
        }
    }
}