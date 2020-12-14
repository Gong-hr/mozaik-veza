import React, {Component} from 'react'
import "./styles/Login.css"
import { FormGroup, Button, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import { Link } from 'react-router-dom'
import {store} from "./index"
import {makeUser, searchAutocomplete} from "./actions"
import {loadState} from "./localStorage";
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import {ga_trackingID, number_per_page} from "./config"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { withWindowSizeListener } from 'react-window-size-listener'
import * as Lang from "./lang"
import ReactGA from 'react-ga'


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            nameExists: false,
            nameInvalid: false,
            emailExists: false,
            emailNotValid: false
        };
    }
    mounted = false;

    componentDidMount() {
        this.mounted = true;
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
        document.title = Lang.SITE_NAME + " - " + Lang.SIGN_UP_SITE_NAME;
        if(loadState("activeUser") !== undefined && loadState("activeUser").activeUser !== undefined && loadState("activeUser").activeUser.token !== undefined) {
            if(this.props.history.length > 2) {
                this.props.history.goBack();
            }
            else {
                this.props.history.push("/saved_entities");
            }
        }
        //store.dispatch(loginUserFailed());


        this.unsubscribe = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.activeUserError !== undefined &&
                store.getState().rootReducer.reducer.activeUserError !== null &&
                (store.getState().rootReducer.reducer.activeUserError.non_field_errors !== undefined || store.getState().rootReducer.reducer.activeUserError.details !== undefined || store.getState().rootReducer.reducer.activeUserError.username !== undefined || store.getState().rootReducer.reducer.activeUserError.email !== undefined)
                && store.getState().rootReducer.reducer.activeUserError.site === "signup" ) {
                if(store.getState().rootReducer.reducer.activeUserError.username !== undefined) {
                    if (store.getState().rootReducer.reducer.activeUserError.username[0] === "A user with that username already exists.") {
                        this.mounted && this.setState({
                            errors: true,
                            nameInvalid: false,
                            emailExists: false,
                            nameExists: true,
                            emailNotValid: false
                        });
                    }
                    else if (store.getState().rootReducer.reducer.activeUserError.username[0] === "Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.") {
                        this.mounted && this.setState({
                            errors: true,
                            nameExists: false,
                            emailExists: false,
                            nameInvalid: true,
                            emailNotValid: false
                        });
                    }
                }
                else if(store.getState().rootReducer.reducer.activeUserError.email !== undefined && store.getState().rootReducer.reducer.activeUserError.email[0] === "A user with that e-mail already exists." ) {
                    this.mounted && this.setState({
                            errors: true,
                            nameInvalid: false,
                            nameExists: false,
                            emailExists: true,
                            emailNotValid: false
                        });
                }
                else if(store.getState().rootReducer.reducer.activeUserError.email !== undefined && store.getState().rootReducer.reducer.activeUserError.email[0] === "Enter a valid email address." ) {
                    this.mounted && this.setState({
                            errors: true,
                            nameInvalid: false,
                            nameExists: false,
                            emailExists: false,
                            emailNotValid: true
                        });
                }
                else {
                    this.mounted && this.setState({
                        errors: true,
                        //username: values.username,
                        nameExists: false,
                        nameInvalid: false,
                        emailExists: false,
                        emailNotValid: false
                    });
                }
            }
            else if(store.getState().rootReducer.reducer.activeUser !== undefined && store.getState().rootReducer.reducer.activeUser !== null) {
                if(store.getState().rootReducer.reducer.activeUser.detail !== undefined || store.getState().rootReducer.reducer.activeUser.non_field_errors !== undefined) {
                    this.mounted && this.setState({
                        errors: true,
                    });
                }
                else {
                    this.mounted && this.setState({
                        errors: false
                    });
                    if(store.getState().rootReducer.reducer.activeUser !== undefined && store.getState().rootReducer.reducer.activeUser !== null
                        && store.getState().rootReducer.reducer.activeUser.username !== undefined && store.getState().rootReducer.reducer.activeUser.token !== undefined) {
                        this.mounted && this.props.history.push("/");
                        }
                }
            }
        })
    }

    handleValidSubmit = (event, values) => {
        this.mounted && this.setState({
            errors: null,
            username: values.username
        });
        store.dispatch(makeUser(values.username, values.password, values.email));
    };
    handleInvalidSubmit = (errors, values) => {
        this.mounted && this.setState({errors, values});
    };

    componentWillUnmount() {
        this.mounted = false;
        try {
            this.unsubscribe();
        } catch (e) {
            console.log(e)
        }
        try {
            this.unlisten();
        } catch (e) {
            console.log(e)
        }
    }

    handleChange = nextValue => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + nextValue + "/0/" + number_per_page)
    };

    render() {
        if(this.state.errors !== undefined && this.state.errors !== null && this.state.errors.username !== undefined) {
            document.getElementById("Login-Username").classList.remove("av-valid");
            document.getElementById("Login-Username").classList.add("is-invalid");
        }
        const { inputValue } = this.props;
        return (
            <div className={"Personal-container container"}>
                <div className="Login-div row">
                    <div className="Login-column col-sm-8">
                        <div className={"Search-Field-header"}>
                            {this.props.windowSize.windowWidth < 1400 ?
                                <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                : <SearchInput className={"d-none d-lg-block"} value={inputValue} onSubmit={this.handleChange}/>
                                }
                            <SearchAutocomplete/>
                        </div>
                        <h1>
                            {Lang.SIGN_UP_SITE_NAME}
                        </h1>
                        <h2>
                            {Lang.SIGN_UP_SUBTITLE}
                        </h2>
                    </div>
                </div>
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
                <div className="Login-div row">
                    <div className="Login-column col-md-6">
                        {this.mounted && <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Username">{Lang.LOGIN_NAME}</Label>
                                <AvField
                                    type="text"
                                    name="username"
                                    id="Login-Username"
                                    placeholder=""
                                    validate={{
                                        required: {value: true, errorMessage: Lang.LOGIN_NAME_ERROR_REQUIRED}
                                    }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Email">{Lang.EMAIL}</Label>
                                <AvField
                                    type="email"
                                    name="email"
                                    id="Login-Email"
                                    placeholder=""
                                    validate={{
                                        email: {value: true, errorMessage: Lang.EMAIL_ERROR}
                                    }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Password">{Lang.PASSWORD}</Label>
                                <AvField
                                    type="password"
                                    errorMessage= {Lang.PASSWORD_ERROR_REQUIRED}
                                    name="password"
                                    id="Login-Password"
                                    placeholder=""
                                    validate={{
                                        required: {value: true, errorMessage: Lang.PASSWORD_ERROR_REQUIRED},
                                        minLength: {value: 8, errorMessage: Lang.PASSWORD_ERROR_LENGTH},
                                    }}
                                    />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Repeat-Password">{Lang.PASSWORD_AGAIN}</Label>
                                <AvField
                                    type="password"
                                    validate={{
                                        required: {value: true, errorMessage: Lang.PASSWORD_ERROR_REQUIRED},
                                        minLength: {value: 8, errorMessage: Lang.PASSWORD_ERROR_LENGTH},
                                        match:{value:'password', errorMessage: Lang.PASSWORDS_NOT_SAME}
                                    }}
                                    name="repeat-password"
                                    id="Login-Repeat-Password"
                                    placeholder="" />
                            </AvGroup>
                            <div className={"Login-alert"}>
                                {this.state.errors !== undefined && this.state.errors && this.state.nameExists ? Lang.USER_WITH_USERNAME_EXISTS : null}
                                {this.state.errors !== undefined && this.state.errors && this.state.nameInvalid ? <span>{Lang.USERNAME_CAN_HAVE_CHAR} <b>@</b>,<b>.</b>,<b>+</b>,<b>-</b> i <b>_</b>.</span> : null}
                                {this.state.errors !== undefined && this.state.errors && this.state.emailExists ? Lang.USER_WITH_EMAIL_EXISTS : null}
                                {this.state.errors !== undefined && this.state.errors && this.state.emailNotValid ? Lang.EMAIL_NOT_VALID : null}
                                {this.state.errors !== undefined && this.state.errors && !this.state.nameExists && !this.state.nameInvalid && !this.state.emailExists && !this.state.emailNotValid ? Lang.SIGN_UP_ERROR : null}
                            </div>
                            <FormGroup>
                                <Button className={"Login-button-submit"} >{Lang.SIGN_UP}</Button>
                            </FormGroup>
                        </AvForm>}
                    </div>
                    <div className="Signup-right-column col-md-6 d-none d-md-block">
                        <h2>{Lang.WITH_PROFILE_YOU_CAN}:</h2>
                        <div className={"Signup-right-column-bullet"}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"check"}/></span> {Lang.WITH_PROFILE_YOU_CAN_SAVE_ENTITY}
                        </div>
                        <div className={"Signup-right-column-bullet"}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"check"}/></span> {Lang.WITH_PROFILE_YOU_CAN_SAVE_SEARCH}
                        </div>
                        <div className={"Signup-right-column-bullet"}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"check"}/></span> {Lang.WITH_PROFILE_YOU_CAN_GET_NOTIFICATION}
                        </div>
                    </div>
                </div>
                <div className="Login-div SignupPage Login-Button-div">
                    <div className={"Login-div-Link"}>{Lang.ALREADY_HAVE_PROFILE}, <Link className={"Login-link"} to={"/login"}>{Lang.LOGIN_SMALL_CAPS}!</Link></div>
                </div>
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
            </div>
        )

    }
}
export default withWindowSizeListener(SignUp);