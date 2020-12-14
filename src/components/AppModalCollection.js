import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import * as Lang from "../lang"

export default class AppModalCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true
        };
    }

    formatDate(time) {
        if (time !== undefined && time !== null) {
            const tmp_date = time !== null && new Date(time);
            const tmp_day = tmp_date.getDate();
            const tmp_month = tmp_date.getMonth() + 1;
            const tmp_year = tmp_date.getFullYear();
            return tmp_day + ". " + tmp_month + ". " + tmp_year + ".";
        }
        else {
            return "";
        }
    };

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

    render() {
        const coll = this.props.params;
        return (
            <div>
                <Modal size="lg" isOpen={this.state.modal} onClosed={() => this.close()} toggle={this.toggle} className={this.props.className}>
                    {/*<ModalHeader toggle={this.toggle}>Log atributa</ModalHeader>*/}
                    <div className="modal-header">
                        <h5 className="modal-title">{coll.name}</h5>
                        <button type="button" className="close myClose" onClick={this.toggle} aria-label="Close"> <span>{Lang.CLOSE}</span> <i className="fa fa-times"></i> </button>
                    </div>
                    <ModalBody>
                        <p>{Lang.SOURCE_NAME}: {coll.source.name}</p>
                        <p>{Lang.COLLECTION_TYPE}: {coll.collection_type.name}</p>
                        <p>{Lang.LAST_CHANGE_FROM_COLL}: {this.formatDate(coll.last_in_log)}</p>
                        <p>{coll.description}</p>
                        <Link to={"/collection#" + coll.source.string_id} target={"_blank"}>
                            {Lang.OPEN_SOURCE} <span><FontAwesomeIcon icon={"long-arrow-alt-right"}/></span>
                        </Link>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
