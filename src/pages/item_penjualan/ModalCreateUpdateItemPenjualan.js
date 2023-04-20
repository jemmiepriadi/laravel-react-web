import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { displayAlert } from '../../redux/actions/notif';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";

import { Button, InputGroup, Modal } from 'react-bootstrap';
import { DatePicker } from 'antd';

import * as itemPenjualanApi from '../../apis/itemPenjualanApi';
// import { DatePicker } from 'rsuite';
import moment from 'moment';
// import DatePicker from 'react-date-picker';

class ModalCreateUpdateItemPenjualan extends React.PureComponent {
    render() {
        const { idToEditItemPenjualans, show, displayAlert, closeModalCreateUpdateAndRefreshTable} = this.props;
        return (
            <Modal show={show} size="xl" onHide={closeModalCreateUpdateAndRefreshTable}>
                <Title isCreate={!idToEditItemPenjualans} onClose={closeModalCreateUpdateAndRefreshTable} />
                <Modal.Body>
                    <Body displayAlert={displayAlert}
                        idToEditItemPenjualans={idToEditItemPenjualans}
                        onSuccessSaveData={closeModalCreateUpdateAndRefreshTable} 
                    />
                </Modal.Body>
            </Modal>
        )
    }
}

function Title(props) {
    return <Modal.Header className="d-flex justify-content-between align-items-center">
        <h1 className="title-text">
            {props.isCreate ? "Create Penjualan" : "Update Penjualan"}
        </h1>
        <button onClick={props.onClose} className="btn btn-danger">x</button>
    </Modal.Header>;
}

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isCreate: true,
            Penjualans: [],
            isSubmitting: false,
            NOTA: "",
            QTY: "",
            KODE_BARANG: "",
        }
    }

    componentDidMount = async () => {
        try {
            const PenjualanResponse = this.props.idToEditItemPenjualans !== null ? itemPenjualanApi.getById(this.props.idToEditItemPenjualans) : null;
            const Penjualan = this.props.idToEditItemPenjualans !== null ? (await PenjualanResponse).data : null;
            
            await this.setData(Penjualan);

        } catch (e) {
            this.setState({
                isLoading: false,
                isError: true
            })
            console.error(e);
        }
    }

    setData = async(values) => {
        if (!values) {
            this.setState({
                isLoading: false
            })
            return;
        }

        const currentPenjualans = values
        this.setState({
            isCreate: false,
            KODE_BARANG: currentPenjualans.KODE_BARANG,
            NOTA: currentPenjualans.ID_NOTA,
            QTY: currentPenjualans.QTY,
            isLoading: false
        })
    }



    handleChange(fieldName, value) {
        this.setState({
            [fieldName]: value
        })
    }

    async handleSubmit(e) {
        let body = {}

        if (this.state.NOTA) {
            body.id = this.props.idToEditItemPenjualans
        }
        body.NOTA = this.state.NOTA;

        body.KODE_BARANG = this.state.KODE_BARANG;
        body.QTY = this.state.QTY;

        e.preventDefault();
        e.stopPropagation();

        this.setState({ isSubmitting: true, response: '' });
        try {
            await itemPenjualanApi.createOrUpdate(body);
            this.setState({
                isSubmitting: false,
            });
            this.props.displayAlert({ message: `Berhasil ${this.state.isCreate ? "Membuat" : "Mengupdate"} Penjualan !`, type: 'success' });
            this.props.onSuccessSaveData();
        } catch (e) {
            this.props.displayAlert({ message: e.message, type: 'error' })
            console.log(e)
        }
        this.setState({ isSubmitting: false });
    }



    isFormValid = () => {
        return this.state.NOTA && this.state.KODE_BARANG && this.state.QTY 
    }

    render() {
        console.log(new Date(this.state.TANGGAL).toLocaleDateString())
        if (this.state.isLoading) return <div>Loading data please wait ...</div>
        if (this.state.isError) return <div>THERE IS SOME ERROR. TRY TO LOAD IT AGAIN</div>
        if (this.state.isSubmitting) return <div>{this.state.isCreate ? "Creating Penjualan" : "Updating Penjualan"} please wait ...</div>

        return <div className="body-div">
            { !this.state.isCreate && <div className="mb-5">
                    <Form.Group as={Row} className="form-prop">
                        <Form.Label column sm={'2'}> id:</Form.Label>        
                        <Col sm={'10'}>
                            <input name={"id"} value={this.props.idToEditItemPenjualans} className={'form-control'} readOnly/>
                            <Form.Text className="text-muted">ID Item Penjualan in database, you can not change this value.</Form.Text>
                        </Col>
                    </Form.Group>
                </div>
            }
            <div className="mb-5">
            <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>NOTA:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={"NOTA"} value={this.state.NOTA}
                            onChange={e => this.handleChange("NOTA", e.target.value)} />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>KODE BARANG:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={"KODE BARANG"} value={this.state.KODE_BARANG}
                            onChange={e => this.handleChange("KODE_BARANG", e.target.value)} />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>Qty:</Form.Label>        
                    <Col sm={'10'}>
                        <InputGroup>
                            <Form.Control className="form-ctr" placeholder={`Qty`}
                                value={this.state.QTY} as="input"
                                onChange={ e => 
                                    this.handleChange("QTY", e.target.value)
                                }
                            />
                        </InputGroup>
                    </Col>
                </Form.Group>
               
            </div>
            <Button onClick={(e) => { this.handleSubmit(e) }} disabled={!this.isFormValid()} variant="primary">
                { this.state.isCreate ? "Save" : "Update" }
            </Button>
        </div>

    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        displayAlert: ({message, type}) => displayAlert({message, type})
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUpdateItemPenjualan);