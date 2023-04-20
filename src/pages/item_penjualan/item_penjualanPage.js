import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { displayAlert } from "../../redux/actions/notif";
import * as itemPenjualanApi from "../../apis/itemPenjualanApi";
import ModalCreateUpdateItemPenjualan from "./ModalCreateUpdateItemPenjualan";

class itemPenjualanPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateUpdateModal: false,
            idToEditItemPenjualans: null,
            penjualan: [],
        }
    }

    componentDidMount = async() => {
        await this.getPenjualan();
    }
    
    getPenjualan = async() =>{
        let promise  = await itemPenjualanApi.getAll();
        let response = await promise.data
        this.setState({
            penjualan: response
        })
    }

    closeModalCreateUpdateAndRefreshTable = async() => {
        this.closeModalCreateUpdate()
        this.getPenjualan();
    }

    closeModalCreateUpdate = () => {
        this.setState({
            idToEditItemPenjualans: null,
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
            idToEditItemPenjualans: data.id,
            showCreateUpdateModal: true
        })
    }

    render(){
        return (
        <div>
            { this.state.showCreateUpdateModal &&  <ModalCreateUpdateItemPenjualan 
                                show={this.state.showCreateUpdateModal}
                                idToEditItemPenjualans={this.state.idToEditItemPenjualans}
                                displayAlert={this.props.displayAlert}
                                onClose={this.closeModalCreateUpdate}
                                closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable}
                                handleChange = {this.handleChange}
                            />
            }
            <Button  onClick={()=>{this.setState({showCreateUpdateModal:true})}} >Create</Button>
            <Body penjualan={this.state.penjualan} handleChange={(field, value) => this.handleChange(field, value)} displayAlert={this.props.displayAlert}/>
        </div>
        )
    }
}
 
class Body extends React.PureComponent {
    onClickUpdate = async(value) =>{
        await this.props.handleChange("idToEditItemPenjualans", value.id)
        this.props.handleChange("showCreateUpdateModal", true)
    }

    onDelete = async(value) => {
        if(window.confirm('Are you sure you want to delete this?')){
            try{
                await itemPenjualanApi.deleteById(value.id)
                this.props.displayAlert({message: "delete successful", type: 'success'})
            }
            catch(e){
                this.props.displayAlert({message: e.message, type: 'error'})
            }
        }
    }

   render() {
    const penjualan = this.props?.penjualan != [] ? this.props.penjualan : []
     return (
        <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>ID</th>
                    <th>NOTA</th>
                    <th>KODE_BARANG</th>
                    <th>QTY</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {penjualan.map((value, index) => {
                    return(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{value.id}</td>
                            <td>{value.NOTA}</td>
                            <td>{value.KODE_BARANG}</td>
                            <td>{value.QTY}</td>
                            <td>
                                <Button onClick={() => {this.onClickUpdate(value)}}>Edit</Button>
                            </td>
                            <td>
                                <Button className="btn btn-danger" onClick={() => this.onDelete(value)}>Delete</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(itemPenjualanPage)