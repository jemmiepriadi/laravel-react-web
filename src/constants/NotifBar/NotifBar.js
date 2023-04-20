import React from 'react'
import styles from './NotifBar.module.css'
import {connect} from 'react-redux'
import {clearAlert} from "../../redux/actions/notif";

class NotifBar extends React.PureComponent {
    className = () => {
        const {type} = this.props
        let c =  styles.wrapper + ' alert'
        if (type === 'error'){
            c = c + ' alert-danger'
        } else {
            c += ` alert-${type}`
        }
        return c
    }

    render(){
        const {message} = this.props
        if (!!message){
            return <div className={this.className()} role="alert">
                <span>{message}</span>
                <button type="button" className="close" onClick={this.onClick}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        } else {
            return <div style={{display:"none"}}/>
        }
    }

    onClick = () => {
        const {dispatch} = this.props
        dispatch(clearAlert())
    }
}



export default connect((state) => {
    const {message,type} = state.notif
    return {message,type}
})(NotifBar)