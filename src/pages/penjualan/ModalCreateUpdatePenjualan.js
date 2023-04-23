import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { displayAlert } from '../../redux/actions/notif';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';

import { Button, InputGroup, Modal } from 'react-bootstrap';
// import { DatePicker } from 'antd';

import * as PenjualansApi from '../../apis/penjualanApi';
// import { DatePicker } from 'rsuite';
import moment from 'moment';
// import DatePicker from 'react-date-picker';

class ModalCreateUpdatePenjualan extends React.PureComponent {
    render() {
        const { idToEditPenjualans, show, displayAlert, closeModalCreateUpdateAndRefreshTable} = this.props;
        return (
            <Modal show={show} size="xl" onHide={closeModalCreateUpdateAndRefreshTable}>
                <Title isCreate={!idToEditPenjualans} onClose={closeModalCreateUpdateAndRefreshTable} />
                <Modal.Body>
                    <Body displayAlert={displayAlert}
                        idToEditPenjualans={idToEditPenjualans}
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
            TANGGAL: "",
            NOTA: "",
            KODE_PELANGGAN: "",
            SUBTOTAL: "",
            // Penjualan Penjualan properties

        }
    }

    componentDidMount = async () => {
        try {
            const PenjualanResponse = this.props.idToEditPenjualans !== null ? PenjualansApi.getById(this.props.idToEditPenjualans) : null;
            const Penjualan = this.props.idToEditPenjualans !== null ? (await PenjualanResponse).data : null;
            
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
            TANGGAL: currentPenjualans.TGL,
            SUBTOTAL: currentPenjualans.SUBTOTAL,
            NOTA: currentPenjualans.ID_NOTA,
            KODE_PELANGGAN: currentPenjualans.KODE_PELANGGAN,
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
            body.ID_NOTA = this.state.NOTA
        }
        body.TGL = this.state.TANGGAL;

        body.KODE_PELANGGAN = this.state.KODE_PELANGGAN;
        body.SUBTOTAL = this.state.SUBTOTAL;
        
        e.preventDefault();
        e.stopPropagation();

        this.setState({ isSubmitting: true, response: '' });
        try {
            await PenjualansApi.createOrUpdate(body);
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
        return this.state.TANGGAL && this.state.KODE_PELANGGAN && this.state.SUBTOTAL 
    }

    render() {
        const ISO_DATE_TIME = "YYYY-MM-DD";
        if (this.state.isLoading) return <div>Loading data please wait ...</div>
        if (this.state.isError) return <div>THERE IS SOME ERROR. TRY TO LOAD IT AGAIN</div>
        if (this.state.isSubmitting) return <div>{this.state.isCreate ? "Creating Penjualan" : "Updating Penjualan"} please wait ...</div>
        const options = [
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]
        return <div className="body-div">
            { !this.state.isCreate && <div className="mb-5">
                    <Form.Group as={Row} className="form-prop">
                        <Form.Label column sm={'2'}>Penjualan NOTA:</Form.Label>        
                        <Col sm={'10'}>
                            <input name={"id"} value={this.state.NOTA} className={'form-control'} readOnly/>
                            <Form.Text className="text-muted">PENJUALAN NOTA in database, you can not change this value.</Form.Text>
                        </Col>
                    </Form.Group>
                </div>
            }
            <div className="mb-5">
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>Penjualan TANGGAL:</Form.Label>        
                    <Col sm={'10'}>
                            <DatePicker
                            selected={moment(this.state.TANGGAL).toDate()}
                            onChange={date => {
                                this.handleChange("TANGGAL", moment(date).format(ISO_DATE_TIME))}}
                            className='form-control'
                            // showTimeSelect
                            // placeholderText='Datetime start'
                            dateFormat='dd-MM-yyyy '
                            // value={moment(this.state.TANGGAL)}
                            // format={'DD/MM/YYYY'}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>KODE PELANGGAN:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={"KODE PELANGGAN"} value={this.state.KODE_PELANGGAN}
                            onChange={e => this.handleChange("KODE_PELANGGAN", e.target.value)} />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>SUBTOTAL:</Form.Label>        
                    <Col sm={'10'}>
                        <InputGroup>
                            <Form.Control className="form-ctr" placeholder={`SUBTOTAL`}
                                value={this.state.SUBTOTAL} as="input"
                                onChange={ e => 
                                    this.handleChange("SUBTOTAL", e.target.value)
                                }
                            />
                            <Form.Text className="text-muted">
                                SUBTOTAL
                            </Form.Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUpdatePenjualan);