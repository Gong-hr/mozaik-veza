import React, { Component } from 'react'
import { store } from "./index"
import { userPasswordToken } from "./actions"
import { Button, FormGroup, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import LostPassModal from './components/LostPassModal'
import * as Lang from "./lang"

export default class UserPasswordToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            showModal: false
        }
    }

    componentDidMount() {
        document.title = Lang.SITE_NAME + " - " + Lang.USER_PASSWORD_TOKEN_PAGE_NAME;
    }

    unsubscribe = null;

    handleValidSubmit = (event, values) => {
        store.dispatch(userPasswordToken(this.props.match.params.user, this.props.match.params.token, values.password ));
        this.unsubscribe=store.subscribe(() => {
            if(store.getState().rootReducer.reducer.userPasswordToken !== undefined) {
                //console.log("userPasswordToken ", store.getState().rootReducer.reducer.userPasswordToken);
            }
            if(store.getState().rootReducer.reducer.userPasswordToken !== undefined && store.getState().rootReducer.reducer.userPasswordToken.error !== undefined) {
                this.setState({
                    error: true
                })
            }
            else if(store.getState().rootReducer.reducer.userPasswordToken !== undefined && store.getState().rootReducer.reducer.userPasswordToken.result !== undefined) {
                this.setState({
                    error: false
                });
                this.props.history.push("/login");
            }
        })
    };

    handleInvalidSubmit = (errors, values) => {
        this.setState({errors, values});
    };

    forgottenPassword = () => {
        this.openModal()
    };

    setModalShow = (e) => {
        this.setState({
            showModal: e
        });
        if(e === false) {
            this.props.history.push("/login")
        }
    };

    openModal() {
        this.setState({
            showModal: true
        })
    };

    componentWillUnmount(){
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    render () {
        return <div className={"container"}>
            <div className={"row Login-div"}>
                 {this.state.error ?
                     <div className={"col-12"} style={{marginTop: "50px", fontSize: "24px"}}>
                         {Lang.USER_PASSWORD_TOKEN_ERROR_START} {store.getState().rootReducer.reducer.userPasswordToken.error.token !== undefined ? Lang.USER_PASSWORD_TOKEN_ERROR_TOKEN : Lang.USER_PASSWORD_TOKEN_ERROR_ELSE}  <br/>
                         <Button className={"Login-lost-pass"} style={{margin: "0", padding: "0", fontSize: "24px"}} onClick={() => this.forgottenPassword()}>{Lang.USER_PASSWORD_TOKEN_SEND_AGAIN}</Button>
                     </div>
                     :
                     <div className={"col-12 Login-column"}>
                         <h1 className="">{Lang.USER_PASSWORD_TOKEN_FOR} {this.props.match.params.user}</h1>
                         <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                             <AvGroup>
                                 <Label className={"Login-input-header"} for="Change-Password">{Lang.PASSWORD}</Label>
                                 <AvField
                                     type="password"
                                     errorMessage= {Lang.USER_PASSWORD_PASSWORD_REQUIRED}
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
                                 <Button className={"Login-button-submit ChangePassword-submit"} >{Lang.USER_PASSWORD_CHANGE}</Button>
                             </FormGroup>
                         </AvForm>
                     </div>
                 }
        </div>
            {this.state.showModal ? <LostPassModal setModal={this.setModalShow} /> : null}
    </div>
    }
}