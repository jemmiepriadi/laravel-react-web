import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { displayAlert } from "../../redux/actions/notif";
import * as pelangganApi from "../../apis/pelangganApi";
import ModalCreateUpdatePelanggan from "./ModalCreateUpdatePelanggan";

class pelangganPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateUpdateModal: false,
            idToEditPelanggans: null,
            pelanggan: [],
        }
    }

    componentDidMount = async() => {
        await this.getPelanggan();
    }
    
    getPelanggan = async() =>{
        let promise  = await pelangganApi.getAll();
        let response = await promise.data
        this.setState({
            pelanggan: response
        })
    }

    closeModalCreateUpdateAndRefreshTable = async() => {
        this.closeModalCreateUpdate()
        this.getPelanggan();
    }

    closeModalCreateUpdate = () => {
        this.setState({
            idToEditPelanggans: null,
            showCreateUpdateModal: false
        })
    }

    handleChange(fieldName, value) {
        this.setState({
            [fieldName]: value,
        })
    }

    onClickUpdate = (data) => {
        this.setState({
            idToEditPelanggans: data.id,
            showCreateUpdateModal: true
        })
    }

    render(){
        console.log(this.state.idToEditPelanggans)
        return (
        <div>
            { this.state.showCreateUpdateModal &&  <ModalCreateUpdatePelanggan 
                                show={this.state.showCreateUpdateModal}
                                idToEditPelanggans={this.state.idToEditPelanggans}
                                displayAlert={this.props.displayAlert}
                                onClose={this.closeModalCreateUpdate}
                                closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable}
                                handleChange = {this.handleChange}
                            />
            }
            <Button  onClick={()=>{this.setState({showCreateUpdateModal:true})}} >Create</Button>
            <Body pelanggan={this.state.pelanggan} handleChange={(field, value) => this.handleChange(field, value)} displayAlert={this.props.displayAlert}/>
        </div>
        )
    }
}
 
class Body extends React.PureComponent {
    onClickUpdate = async(value) =>{
         this.props.handleChange("idToEditPelanggans", value.ID_PELANGGAN)
        this.props.handleChange("showCreateUpdateModal", true)
    }

    onDelete = async(value) => {
        if(window.confirm('Are you sure you want to delete this?')){
            try{
                await pelangganApi.deleteById(value.ID_PELANGGAN)
                this.props.displayAlert({message: "delete successful", type: 'success'})
            }
            catch(e){
                this.props.displayAlert({message: e.message, type: 'error'})
            }
        }
    }
   render() {
    const pelanggan = this.props?.pelanggan != [] ? this.props.pelanggan : []
     return (
       <table className="table">
        <thead>
            <tr>
                <th>No</th>
                <th>ID_PELANGGAN</th>
                <th>NAMA</th>
                <th>DOMISILI</th>
                <th>JENIS_KELAMIN</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {pelanggan.map((value, index) => {
                return(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{value.ID_PELANGGAN}</td>
                        <td>{value.NAMA}</td>
                        <td>{value.DOMISILI}</td>
                        <td>{value.JENIS_KELAMIN}</td>
                        <td>
                            <Button onClick={()=>this.onClickUpdate(value)}>Edit</Button>
                        </td>
                        <td>
                            <Button className="btn btn-danger" onClick={()=>this.onDelete(value)}>Delete</Button>
                        </td>
                    </tr>
                )
            })}
        </tbody>
       </table>
     )
   }
 }
 

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        displayAlert: ({ message, type, duration }) => displayAlert({ message, type, duration })
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(pelangganPage)