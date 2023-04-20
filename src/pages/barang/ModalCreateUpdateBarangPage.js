import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { displayAlert } from '../../redux/actions/notif';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import { Button, InputGroup, Modal } from 'react-bootstrap';

import * as BarangsApi from '../../apis/barangApi';

class ModalCreateUpdateBarang extends React.PureComponent {
    render() {
        const { idToEditBarangs, show, displayAlert, closeModalCreateUpdateAndRefreshTable} = this.props;
        return (
            <Modal show={show} size="xl" onHide={closeModalCreateUpdateAndRefreshTable}>
                <Title isCreate={!idToEditBarangs} onClose={closeModalCreateUpdateAndRefreshTable} />
                <Modal.Body>
                    <Body displayAlert={displayAlert}
                        idToEditBarangs={idToEditBarangs}
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
            {props.isCreate ? "Create Barang" : "Update Barang"}
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
            isSubmitting: false,
            KODE: "",
            NAMA: "",
            KATEGORI: "",
            HARGA: ""
        }
    }

    componentDidMount = async () => {
        try {
            const BarangResponse = this.props.idToEditBarangs !== null ? BarangsApi.getById(this.props.idToEditBarangs) : null;
            const Barang = this.props.idToEditBarangs !== null ? (await BarangResponse).data : null;
            
            await this.setData(Barang);

        } catch (e) {
            this.setState({
                isLoading: false,
                isError: true
            })
            console.error(e);
        }
    }

    setData = (values) => {
        if (!values) {
            this.setState({
                isLoading: false
            })
            return;
        }

        this.setState({
            isCreate: false,
            KODE: values.KODE ,
            NAMA: values.NAMA,
            KATEGORI: values.KATEGORI,
            HARGA: values.HARGA,
            isLoading: false,
        })
    }


    handleChange(fieldName, value) {
        this.setState({
            [fieldName]: value
        })
    }

    async handleSubmit(e) {
        let body = {}

        if (this.state.KODE) {
            body.KODE = this.state.KODE
        }
        body.NAMA = this.state.NAMA;

        body.KATEGORI = this.state.KATEGORI;
        body.HARGA = this.state.HARGA;

        e.preventDefault();
        e.stopPropagation();

        this.setState({ isSubmitting: true, response: '' });
        try {
            await BarangsApi.createOrUpdate(body);
            this.setState({
                isSubmitting: false,
            });
            this.props.displayAlert({ message: `Berhasil ${this.state.isCreate ? "Membuat" : "Mengupdate"} Barang !`, type: 'success' });
            this.props.onSuccessSaveData();
        } catch (e) {
            this.props.displayAlert({ message: e.message, type: 'error' })
            console.log(e)
        }
        this.setState({ isSubmitting: false });
    }



    isFormValid = () => {
        return this.state.NAMA && this.state.KATEGORI && this.state.HARGA 
    }

    render() {
        if (this.state.isLoading) return <div>Loading data please wait ...</div>
        if (this.state.isError) return <div>THERE IS SOME ERROR. TRY TO LOAD IT AGAIN</div>
        if (this.state.isSubmitting) return <div>{this.state.isCreate ? "Creating Barang" : "Updating Barang"} please wait ...</div>
        const options = [
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]
        return <div className="body-div">
            { !this.state.isCreate && <div className="mb-5">
                    <Form.Group as={Row} className="form-prop">
                        <Form.Label column sm={'2'}>Barang Id:</Form.Label>        
                        <Col sm={'10'}>
                            <input name={"id"} value={this.state.KODE} className={'form-control'} readOnly/>
                            <Form.Text className="text-muted">BARANG ID in database, you can not change this value.</Form.Text>
                        </Col>
                    </Form.Group>
                </div>
            }
            <div className="mb-5">
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>Barang Name:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={""} value={this.state.NAMA}
                            onChange={e => this.handleChange("NAMA", e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>KATEGORI BARANG:</Form.Label>        
                    <Col sm={'10'}>
                        <Form.Control className="form-ctr" placeholder={""} value={this.state.KATEGORI}
                            onChange={e => this.handleChange("KATEGORI", e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="form-prop">
                    <Form.Label column sm={'2'}>HARGA BARANG</Form.Label>        
                    <Col sm={'10'}>
                        <InputGroup>
                            <Form.Control className="form-ctr" placeholder={`Harga Barang`}
                                value={this.state.HARGA} as="input"
                                onChange={ e => 
                                    this.handleChange("HARGA", e.target.value)
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUpdateBarang);