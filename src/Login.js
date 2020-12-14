import React, {Component} from 'react'
import "./styles/Login.css"
import { Button, FormGroup, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import LostPassModal from './components/LostPassModal'
import {store} from "./index"
import {getToken, searchAutocomplete} from "./actions"
import {loadState} from "./localStorage";
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import {ga_trackingID, number_per_page} from "./config"
import { withWindowSizeListener } from 'react-window-size-listener'
import {SITE_NAME, LOGIN_PAGE_NAME, LOGIN_PAGE_SUBTITLE, LOGIN_NAME, PASSWORD, LOGIN_NAME_ERROR_REQUIRED, PASSWORD_ERROR_REQUIRED, PASSWORD_ERROR_LENGTH, LOGIN_ERROR, LOGIN, FORGOT_PASSWORD} from './lang'
import ReactGA from 'react-ga'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            showModal: false
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
        document.title = SITE_NAME + " - " + LOGIN_PAGE_NAME;
        //store.dispatch(loginUserFailed());
        if(loadState("activeUser") !== undefined && loadState("activeUser").activeUser !== undefined && loadState("activeUser").activeUser.token !== undefined) {
            if(this.props.history.length > 2) {
                this.props.history.goBack();
            }
            else {
                this.props.history.push("/saved_entities");
            }
        }
    }

    handleValidSubmit = (event, values) => {
        this.state.errors !== undefined && this.state.errors !== null && this.setState({errors: null});
        store.dispatch(getToken(values.username, values.password, "login"));
        this.unsubscribe = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.activeUserError !== undefined && store.getState().rootReducer.reducer.activeUserError !== null
                && (store.getState().rootReducer.reducer.activeUserError.non_field_errors !== undefined || store.getState().rootReducer.reducer.activeUserError.details !== undefined) && store.getState().rootReducer.reducer.activeUserError.site === "login" ) {
                this.mounted && this.setState({
                    errors: true,
                    username: values.username
                });
            }
            else if(store.getState().rootReducer.reducer.activeUser !== undefined && store.getState().rootReducer.reducer.activeUser !== null) {
                if(store.getState().rootReducer.reducer.activeUser.detail !== undefined || store.getState().rootReducer.reducer.activeUser.non_field_errors !== undefined) {
                    this.mounted && this.setState({
                        errors: true,
                        username: values.username
                    });
                }
                else {
                    this.mounted && this.setState({
                        errors: false,
                        username: values.username
                    });
                }
            }
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if(prevState.username !== this.state.username && this.state.username !== undefined && this.state.username !== "") {
            if(store.getState().rootReducer.reducer.activeUser.token !== undefined) {
                //if(this.props.history.length > 2) {
                //    this.props.history.goBack();
                //}
                //else {
                    this.mounted && this.props.history.push("/");
                //}
            }
        }
    }

    handleInvalidSubmit = (errors, values) => {
        this.mounted && this.setState({errors, values});
    };

    forgottenPassword = () => {
        this.openModal()
    };

    setModalShow = (e) => {
        this.setState({
            showModal: e
        })
    };

    openModal() {
        this.setState({
            showModal: true
        })
    };

    componentWillUnmount() {
        this.mounted = false;
        try {
            this.unsubscribe();
        } catch (e) {
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
        const { inputValue } = this.props;
        return (
            <div className={"Personal-container container"}>
                <div className="Login-div row">
                    <div className="Login-column col-sm-8">
                        <div className={"Search-Field-header"}>
                            {this.props.windowSize.windowWidth < 1400 ?
                                <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                :
                                <SearchInput className={"d-none d-lg-block"} value={inputValue} onSubmit={this.handleChange}/>}
                            <SearchAutocomplete/>
                        </div>
                        <h1>
                            {LOGIN_PAGE_NAME}
                        </h1>
                        <h2>
                            {LOGIN_PAGE_SUBTITLE}
                        </h2>
                    </div>
                </div>
                <div className="row empty-row"></div>
                <div className="row empty-row "></div>
                <div className="Login-div row">
                    <div className="Login-column col-sm-8">
                        <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Username">{LOGIN_NAME}</Label>
                                <AvField
                                    type="text"
                                    name="username"
                                    id="Login-Username"
                                    placeholder=""
                                    validate={{
                                        required: {value: true, errorMessage: LOGIN_NAME_ERROR_REQUIRED}
                                    }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Password">{PASSWORD}</Label>
                                <AvField
                                    type="password"
                                    name="password"
                                    id="Login-Password"
                                    placeholder=""
                                    validate={{
                                        required: {value: true, errorMessage: PASSWORD_ERROR_REQUIRED},
                                        minLength: {value: 8, errorMessage: PASSWORD_ERROR_LENGTH},
                                    }}
                                />
                            </AvGroup>
                            <div className={"Login-alert"}>
                                {this.state.errors !== undefined && this.state.errors ? LOGIN_ERROR : null}
                            </div>
                            <FormGroup>
                                <Button className={"Login-button-submit"} >{LOGIN}</Button>
                            </FormGroup>
                        </AvForm>
                    </div>
                </div>
                <div className="Login-div LoginPage Login-Button-div">
                    <Button className={"Login-lost-pass"} onClick={() => this.forgottenPassword()}>{FORGOT_PASSWORD}</Button>
                </div>
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
                {this.state.showModal ? <LostPassModal setModal={this.setModalShow} /> : null}
            </div>
        )

    }
}

export default withWindowSizeListener(Login);