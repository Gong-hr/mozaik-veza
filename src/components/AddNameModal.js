import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Button, FormGroup, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import {store} from "../index"
import {setSavedLink} from "../actions"
import {loadState} from "../localStorage"
import * as Lang from "../lang"

export default class AddNameModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            alreadySaved: false,
            nameExists: false
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
        store.dispatch(setSavedLink(values.text, this.props.params, loadState("activeUser").activeUser.token));
        this.unsubscribe = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.setSearchName !== undefined && store.getState().rootReducer.reducer.setSearchName !== null) {
                if(store.getState().rootReducer.reducer.setSearchName.error !== undefined || (store.getState().rootReducer.reducer.setSearchName !== undefined && store.getState().rootReducer.reducer.setSearchName.non_field_errors !== undefined) ) {
                    if(store.getState().rootReducer.reducer.setSearchName.non_field_errors[0] === "The fields owner, saved_url must make a unique set." ) {
                        this.setState({
                            alreadySaved: true,
                            nameExists: false,
                            error: true
                        })
                    }
                    else if(store.getState().rootReducer.reducer.setSearchName.non_field_errors[0] === "The fields owner, name must make a unique set.") {
                        this.setState({
                            nameExists: true,
                            alreadySaved: false,
                            error: true
                        })
                    }
                    else {
                        this.setState({
                            error: true,
                            nameExists: false,
                            alreadySaved: false,
                        })
                    }
                }
                else {
                    this.setState({
                        error: false,
                        nameExists: false,
                        alreadySaved: false,
                    });
                    this.close();
                }
            }
        });
    };

    handleInvalidSubmit = (errors, values) => {
        this.setState({errors, values});
    };

    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    render() {
        if(this.state.error !== undefined && this.state.error !== null && this.state.error === true) {
            document.getElementById("Save-Search-Name").classList.remove("av-valid");
            document.getElementById("Save-Search-Name").classList.add("is-invalid");
        }

        return (
            <div>
                <Modal className="LostPass-modal" isOpen={this.state.modal} onClosed={() => this.close()} toggle={this.toggle} >
                    <div className="modal-header">
                        <h5 className="modal-title">{Lang.SAVE_SEARCH}</h5>
                        <Button type="button" className="close myClose" onClick={this.toggle} aria-label="Close"> <span>{Lang.CLOSE}</span> <i className="fa fa-times"></i> </Button>
                    </div>
                    <ModalBody>
                        <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Save-Search-Name">{Lang.SAVED_SEARCH_NAME}</Label>
                                <AvField
                                    type="text"
                                    name="text"
                                    id="Save-Search-Name"
                                    placeholder=""
                                    validate={{
                                        maxLength: {value: 64, errorMessage: Lang.SAVED_SEARCH_NAME_ERROR_LENGHT},
                                        required: {value: true, errorMessage: Lang.SAVED_SEARCH_NAME_ERROR_REQUIRED}
                                    }}
                                />
                            </AvGroup>
                            {(this.state.error !== undefined && this.state.error !== null) ?
                                <div className={"Login-alert"}>
                                    {this.state.error && this.state.alreadySaved ? Lang.SAVED_SEARCH_NAME_ERROR_EXISTS : null}
                                    {this.state.error && this.state.nameExists ? Lang.SAVED_SEARCH_NAME_ERROR_NAME_EXISTS : null}
                                </div>
                                : null }
                            <FormGroup>
                                <Button className={"LostPassword-submit"}>{Lang.SAVE}</Button>
                            </FormGroup>
                        </AvForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
