import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Button, FormGroup, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import {store} from "../index"
import {sendLostPassword} from "../actions"
import * as Lang from "../lang"

export default class LostPassModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true
        };
    }

    toggle = () => {
        this.props.setModal(!this.state.modal);
        this.setState({
            modal: !this.state.modal
        });
    };

    close = () => {
        this.props.setModal(false);
        this.setState({
            modal: false
        });
    };

    unsubscribe = null;

    handleValidSubmit = (event, values) => {
        this.setState({errors: null});
        if(values.email !== "") {
            store.dispatch(sendLostPassword(values.email));
        }
        this.unsubscribe = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.sentLostPassword !== undefined && store.getState().rootReducer.reducer.sentLostPassword !== null) {
                if(store.getState().rootReducer.reducer.sentLostPassword.error !== undefined) {
                    if(store.getState().rootReducer.reducer.sentLostPassword.error.email !== undefined) {
                        this.setState({
                            error: true
                        })
                    }
                }
                if(store.getState().rootReducer.reducer.sentLostPassword.result !== undefined) {
                    this.setState({
                        error: false
                    });
                    this.close();
                }
            }
        });
    };

    componentWillUnmount(){
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    handleInvalidSubmit = (errors, values) => {
        this.setState({errors, values});
    };

    render() {
        if(this.state.error !== undefined && this.state.error !== null && this.state.error === true) {
            document.getElementById("LostPass-Email").classList.remove("av-valid");
            document.getElementById("LostPass-Email").classList.add("is-invalid");
        }
        return (
            <div>
                <Modal className="LostPass-modal" isOpen={this.state.modal} onClosed={() => this.close()} toggle={this.toggle} >
                    <div className="modal-header">
                        <h5 className="modal-title">{Lang.FORGOT_PASSWORD}</h5>
                        <Button type="button" className="close myClose" onClick={this.toggle} aria-label="Close"> <span>{Lang.CLOSE}</span> <i className="fa fa-times"></i> </Button>
                    </div>
                    <ModalBody>
                        <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="LostPass-Email">{Lang.EMAIL_ADDRESS}</Label>
                                <AvField
                                    type="email"
                                    name="email"
                                    id="LostPass-Email"
                                    placeholder=""
                                    validate={{
                                        email: {value: true, errorMessage: Lang.EMAIL_ERROR}
                                    }}
                                />
                            </AvGroup>
                            {(this.state.error !== undefined && this.state.error !== null) ?
                                <div className={"Login-alert"}>
                                    {this.state.error ? Lang.USER_WITH_USERNAME_DOES_NOT_EXIST : null}
                                </div>
                            : null }
                            <FormGroup>
                                <Button className={"LostPassword-submit"}>{Lang.SEND}</Button>
                            </FormGroup>
                        </AvForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
