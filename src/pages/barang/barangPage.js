import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { displayAlert } from "../../redux/actions/notif";
import ModalCreateUpdateBarangPage from "./ModalCreateUpdateBarangPage";
import * as barangApi from "../../apis/barangApi";

class BarangPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateUpdateModal: false,
            idToEditBarangs: null,
            barang: [],
        }
    }

    componentDidMount = async() => {
        await this.getBarang();
    }
    
    getBarang = async() =>{
        let promise  = await barangApi.getAll();
        let response = await promise.data
        this.setState({
            barang:response
        })
    }

    closeModalCreateUpdateAndRefreshTable = async() => {
        this.closeModalCreateUpdate()
        this.getBarang();
    }

    closeModalCreateUpdate = () => {
        this.setState({
            idToEditBarangs: null,
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
            idToEditBarangs: data.id,
            showCreateUpdateModal: true
        })
    }

    render(){
        return (
        <div>
            { this.state.showCreateUpdateModal &&  <ModalCreateUpdateBarangPage 
                                show={this.state.showCreateUpdateModal}
                                idToEditBarangs={this.state.idToEditBarangs}
                                displayAlert={this.props.displayAlert}
                                onClose={this.closeModalCreateUpdate}
                                closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable}
                                handleChange = {this.handleChange}
                            />
            }
            <Button  onClick={()=>{this.setState({showCreateUpdateModal:true})}} >Create</Button>
            <Body barang={this.state.barang} handleChange={(field, value) => this.handleChange(field, value)} displayAlert={this.props.displayAlert} />
        </div>
        )
    }
}
 
class Body extends React.PureComponent {
    onClickUpdate = async(value) =>{
        await this.props.handleChange("idToEditBarangs", value.KODE)
        this.props.handleChange("showCreateUpdateModal", true)
    }

    onDelete = async(value) => {
        if(window.confirm('Are you sure you want to delete this?')){
            try{
                await barangApi.deletebyId(value.KODE)
                this.props.displayAlert({message: "delete successful", type: 'success'})
            }
            catch(e){
                this.props.displayAlert({message: e.message, type: 'error'})
            }
        }
    }
   render() {
    const barang = this.props.barang !== [] ? this.props.barang : [] 
     return (
        <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>KODE</th>
                    <th>NAMA</th>
                    <th>KATEGORI</th>
                    <th>HARGA</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {barang.map((value, index) => {
                    return(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{value.KODE}</td>
                            <td>{value.NAMA}</td>
                            <td>{value.KATEGORI}</td>
                            <td>{value.HARGA}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(BarangPage)