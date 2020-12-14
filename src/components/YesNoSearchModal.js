import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Button } from 'reactstrap'
import {deleteSavedSearch} from "../actions"
import {store} from "../index"
import {DELETE_SAVE_SEARCH_CONFIRMATION, YES_CAPS, NO_CAPS, CLOSE} from "../lang"

export default class YesNoSearchModal extends Component {
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

    handleYes = () => {
        this.props.setModal(false);
        this.setState({
            modal: false
        });
        store.dispatch(deleteSavedSearch(this.props.params[0], this.props.params[1]));
    };

    handleNo = () => {
        this.props.setModal(false);
        this.setState({
            modal: false
        });
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
                        <h5 className="modal-title">{DELETE_SAVE_SEARCH_CONFIRMATION}</h5>
                        <Button type="button" className="close myClose" onClick={this.toggle} aria-label="Close"> <span>{CLOSE}</span> <i className="fa fa-times"></i> </Button>
                    </div>
                    <ModalBody>
                        <Button onClick={()=>this.handleYes()} className={"yes"} >{YES_CAPS}</Button>
                        <Button onClick={()=>this.handleNo()} className={"no"} >{NO_CAPS}</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
