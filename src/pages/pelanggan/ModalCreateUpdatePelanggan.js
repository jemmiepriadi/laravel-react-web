import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { displayAlert } from '../../redux/actions/notif';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import { Button, InputGroup, Modal } from 'react-bootstrap';

import * as pelangganApi from '../../apis/pelangganApi';

class ModalCreateUpdatePelanggan extends React.PureComponent {
    render() {
        const { idToEditPelanggans, show, displayAlert, closeModalCreateUpdateAndRefreshTable} = this.props;
        return (
            <Modal show={show} size="xl" onHide={closeModalCreateUpdateAndRefreshTable}>
                <Title isCreate={!idToEditPelanggans} onClose={closeModalCreateUpdateAndRefreshTable} />
                <Modal.Body>
                    <Body displayAlert={displayAlert}
                        idToEditPelanggans={idToEditPelanggans}
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
            {props.isCreate ? "Create Pelanggan" : "Update Pelanggan"}
        </h1>
        <button onClick={props.onClose} className="btn btn-danger">x</button>
    </Modal.Header>;
}

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            JENIS_KELAMIN: '',
            isCreate: true,
            isSubmitting: false,
            DOMISILI: '',
            NAMA: "",
            ID_PELANGGAN: "",
            isLoading: true,

        }
    }

    componentDidMount = async () => {
        try {
            const PelangganResponse = this.props.idToEditPelanggans !== null ? pelangganApi.getById(this.props.idToEditPelanggans) : null;
            const Pelanggan = this.props.idToEditPelanggans !== null ? (await PelangganResponse).data : null;
            
            await this.setData(Pelanggan);

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

        const currentPelanggans = values ;
        this.setState({
            JENIS_KELAMIN: currentPelanggans.JENIS_KELAMIN,
            DOMISILI: currentPelanggans.DOMISILI,
            NAMA: currentPelanggans.NAMA,
            ID_PELANGGAN: currentPelanggans.ID_PELANGGAN,
            isLoading: false,
            isCreate: false,
        })
    }


    handleChange(fieldName, value) {
        this.setState({
            [fieldName]: value
        })
    }

    async handleSubmit(e) {
        let body = {}

        if (this.state.ID_PELANGGAN) {
            body.id = this.state.ID_PELANGGAN
        }
        body.NAMA = this.state.NAMA;

        body.DOMISILI = this.state.DOMISILI;
        body.JENIS_KELAMIN = this.state.JENIS_KELAMIN;

        e.preventDefault();
        e.stopPropagation();

        this.setState({ isSubmitting: true, response: '' });
        try {
            await pelangganApi.createOrUpdate(body);
            this.setState({
                isSubmitting: false,
            });
            this.props.displayAlert({ message: `Berhasil ${this.state.isCreate ? "Membuat" : "Mengupdate"} Pelanggan !`, type: 'success' });
            this.props.onSuccessSaveData();
        } catch (e) {
            this.props.displayAlert({ message: e.message, type: 'error' })
            console.log(e)
        }
        this.setState({ isSubmitting: false });
    }



    isFormValid = () => {
        return this.state.NAMA && this.state.DOMISILI && this.state.JENIS_KELAMIN 
    }

    render() {
        if (this.state.isLoading) return <div>Loading data please wait ...</div>
        if (this.state.isError) return <div>THERE IS SOME ERROR. TRY TO LOAD IT AGAIN</div>
        if (this.state.isSubmitting) return <div>{this.state.isCreate ? "Creating Pelanggan" : "Updating Pelanggan"} please wait ...</div>

        return <div className="body-div">
            { !this.state.isCreate && <div className="mb-5">
                    <Form.Group as={Row} className="form-prop">
                        <Form.Label column sm={'2'}>Pelanggan Id:</Form.Label>        
                        <Col sm={'10'}>
                            <input name={"id"} value={this.state.ID_PELANGGAN} className={'form-control'} readOnly/>
                            <Form.Text className="text-muted">PELANGGAN ID in database, you can not change this value.</Form.Text>
                        </Col>
                    </Form.Group>
                </div>
            }
            <div className="mb-5">
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>Pelanggan Name:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={""} value={this.state.NAMA}
                            onChange={e => this.handleChange("NAMA", e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>Pelanggan DOMISILI:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={""} value={this.state.DOMISILI}
                            onChange={e => this.handleChange("DOMISILI", e.target.value)} />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>JENIS_KELAMIN:</Form.Label>        
                    <Col sm={'10'}>
                        <InputGroup>
                            <Form.Control className="form-ctr" placeholder={`Jenis Kelamin`}
                                value={this.state.JENIS_KELAMIN} as="input"
                                onChange={ e => 
                                    this.handleChange("JENIS_KELAMIN", e.target.value)
                                }
                            />
                            <Form.Text className="text-muted">
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUpdatePelanggan);