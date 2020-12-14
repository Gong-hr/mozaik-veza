import React, {Component} from 'react'
import {store} from "./index"
import {verifyMail} from "./actions"
import {SITE_NAME, VERIFY_EMAIL_PAGE_NAME, VERIFY_EMAIL_ERROR, VERIFY_EMAIL_SUCCESS} from './lang'

export default class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        }
    }

    componentDidMount() {
        document.title = {SITE_NAME} + " - " + {VERIFY_EMAIL_PAGE_NAME};
        store.dispatch(verifyMail(this.props.match.params.user, this.props.match.params.token ));
        this.unsubscribe=store.subscribe(() => {
            if(store.getState().rootReducer.reducer.verifiedEmail !== undefined && store.getState().rootReducer.reducer.verifiedEmail.error !== undefined) {
                this.setState({
                    error: true
                })
            }
            else if(store.getState().rootReducer.reducer.verifiedEmail !== undefined && store.getState().rootReducer.reducer.verifiedEmail.result !== undefined) {
                this.setState({
                    error: false
                })
            }
        })
    }
    componentWillUnmount(){
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    render () {
        return <div className={"container"}>
                <div className={"row Login-div"}>
                    <div className={"col-12"} style={{marginTop: "50px", fontSize: "24px"}}>
                        {this.state.error ?
                            <span>{VERIFY_EMAIL_ERROR}</span>
                            :
                            <span>{VERIFY_EMAIL_SUCCESS}</span>}
                    </div>
                </div>
        </div>
    }
}