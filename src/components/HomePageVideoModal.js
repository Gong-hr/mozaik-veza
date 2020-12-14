import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Button } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {about_video_url, how_to_video} from '../config'

export default class HomePageVideoModal extends Component {
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

    render() {
        let src = "";
        if(this.props.params === "aboutVideo"){
            src = about_video_url
        }
        else if(this.props.params === "howToVideo") {
            src = how_to_video
        }
        return (
            <div>
                <Modal className="modalVideo" isOpen={this.state.modal} onClosed={() => this.close()} toggle={this.toggle} >
                    <div className="modal-header modalVideo-header">
                        <Button type="button" className="close myClose closeVideo" onClick={this.toggle} aria-label="Close">
                            <span><FontAwesomeIcon icon={"times"}/></span>
                        </Button>
                    </div>
                    <ModalBody>
                        <div className="embed-responsive  embed-responsive-16by9">
                            <iframe className="embed-responsive-item"
                                    src={src}
                                    title={this.props.params}
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    modestbranding="1"
                                    rel="0"
                                    allowFullScreen></iframe>
                                </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
