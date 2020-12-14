import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Button, FormGroup, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import {store} from "../index"
import {changeUserPassword} from "../actions"
import {loadState} from "../localStorage"
import * as Lang from "../lang"

export default class ChangePassModal extends Component {
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

    handleValidSubmit = (event, values) => {
        this.setState({errors: null});
        store.dispatch(changeUserPassword(loadState("activeUser").activeUser.username, values.password, loadState("activeUser").activeUser.token ));
        this.unsubscribe = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.changeUserPassword !== undefined && store.getState().rootReducer.reducer.changeUserPassword !== null) {
                if(store.getState().rootReducer.reducer.changeUserPassword.error !== undefined) {
                        this.setState({
                            error: true
                        })
                }
                else {
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
            document.getElementById("Login-Password").classList.remove("av-valid");
            document.getElementById("Login-Password").classList.add("is-invalid");
            document.getElementById("Login-Repeat-Password").classList.remove("av-valid");
            document.getElementById("Login-Repeat-Password").classList.add("is-invalid");
        }
        return (
            <div>
                <Modal className="LostPass-modal" isOpen={this.state.modal} onClosed={() => this.close()} toggle={this.toggle} >
                    <div className="modal-header">
                        <h5 className="modal-title">{Lang.USER_PASSWORD_TOKEN_PAGE_NAME}</h5>
                        <Button type="button" className="close myClose" onClick={this.toggle} aria-label="Close"> <span>{Lang.CLOSE}</span> <i className="fa fa-times"></i> </Button>
                    </div>
                    <ModalBody>
                        <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Change-Password">{Lang.PASSWORD}</Label>
                                <AvField
                                    type="password"
                                    errorMessage= {Lang.PASSWORD_ERROR_REQUIRED}
                                    name="password"
                                    id="Change-Password"
                                    placeholder=""
                                    validate={{
                                        required: {value: true, errorMessage: Lang.PASSWORD_ERROR_REQUIRED},
                                        minLength: {value: 8, errorMessage: Lang.PASSWORD_ERROR_LENGTH},
                                    }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Change-Repeat-Password">{Lang.PASSWORD_AGAIN}</Label>
                                <AvField
                                    type="password"
                                    validate={{
                                        required: {value: true, errorMessage: Lang.PASSWORD_ERROR_REQUIRED},
                                        minLength: {value: 8, errorMessage: Lang.PASSWORD_ERROR_LENGTH},
                                        match:{value:'password', errorMessage: Lang.PASSWORDS_NOT_SAME}
                                    }}
                                    name="repeat-password"
                                    id="Change-Repeat-Password"
                                    placeholder="" />
                            </AvGroup>
                            {(this.state.error !== undefined && this.state.error !== null) ?
                                <div className={"Login-alert"}>
                                    {this.state.error ? Lang.ERROR_OCCURRED : null}
                                </div>
                                : null }
                            <FormGroup>
                                <Button className={"ChangePassword-submit"} >{Lang.SAVE}</Button>
                            </FormGroup>
                        </AvForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
