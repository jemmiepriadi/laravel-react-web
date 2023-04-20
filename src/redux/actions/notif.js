
/**
 * @see NotifBar for type
 */
export function displayAlert({message,type,duration=6000}){
    return (dispatch, getState) => {
        const {notif:{counter}} = getState()
        dispatch(__setAlert({message,type,counter: counter + 1}))
        //clear alert after 3000 seconds
        setTimeout(()=>{
            dispatch(__setAlert({message:'',type:'',counter: counter+ 1}))
        },duration)
    }
}

export function clearAlert(){
    return (dispatch, getState) => {
        const {notif:{counter}} = getState()
        dispatch(__setAlert({message:'',type:'',counter}))
    }
}

//do not export this function
//instead, use the displayAlert and clearAlert method!
function __setAlert({message,type,counter}){
    return {type: "NOTIF_SET_ALERT", payload: {message,type,counter}}
}