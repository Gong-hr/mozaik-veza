import React, {Component} from 'react'
import "./styles/Login.css"
import { Button, FormGroup, Label } from 'reactstrap'
import { AvForm, AvGroup, AvField, AvInput/*, AvCheckbox*/ } from 'availity-reactstrap-validation'
import ChangePassModal from './components/ChangePassModal'
import {store} from "./index"
import {changeUserInfo, getUserInfo, searchAutocomplete} from "./actions"
import {loadState} from "./localStorage"
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import {ga_trackingID, number_per_page} from "./config"
import { withWindowSizeListener } from 'react-window-size-listener'
import * as Lang from "./lang"
import ReactGA from 'react-ga'
import PersonalError from "./containers/personalErrorsData";


class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            acceptMail: false,
            showModal: false,
            loaded: false,
            loggedIn: ""
        };
    }
    mounted = false;
    
    componentDidMount() {
        this.mounted = true;
        document.title = Lang.SITE_NAME + " - " + Lang.PERSONAL_PAGE_NAME;
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
        if(loadState("activeUser") !== undefined) {
            if (loadState("activeUser").activeUser === undefined || loadState("activeUser").activeUser.token === undefined) {
                this.props.history.push("/login");
            } else {
                store.dispatch(getUserInfo(loadState("activeUser").activeUser.username, loadState("activeUser").activeUser.token));
                if (store.getState().rootReducer.reducer.changeUserData !== undefined) {
                    if (store.getState().rootReducer.reducer.changeUserDataFinish) {
                        this.mounted && this.setState({
                            name: store.getState().rootReducer.reducer.changeUserData.first_name,
                            surname: store.getState().rootReducer.reducer.changeUserData.last_name,
                            email: store.getState().rootReducer.reducer.changeUserData.email,
                            acceptMail: store.getState().rootReducer.reducer.changeUserData.send_notification_on_change_watched_entity,
                            loaded: true
                        });
                    }
                }
                if (store.getState().rootReducer.reducer.activeUser.token !== undefined) {
                    this.mounted && this.setState({
                        loggedIn: store.getState().rootReducer.reducer.activeUser.token
                    })
                }
            }
        }
        else {
            this.props.history.push("/login");
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(store.getState().rootReducer.reducer.changeUserData !== null) {
            if (store.getState().rootReducer.reducer.changeUserData.first_name !== prevState.name) {
                this.mounted && this.setState({
                    name: store.getState().rootReducer.reducer.changeUserData.first_name
                })
            }
            if (store.getState().rootReducer.reducer.changeUserData.last_name !== prevState.surname) {
                this.mounted && this.setState({
                    surname: store.getState().rootReducer.reducer.changeUserData.last_name
                })
            }
            if (store.getState().rootReducer.reducer.changeUserData.email !== prevState.email) {
                this.mounted && this.setState({
                    email: store.getState().rootReducer.reducer.changeUserData.email
                })
            }
            if (store.getState().rootReducer.reducer.changeUserData.send_notification_on_change_watched_entity !== prevState.acceptMail) {
                this.mounted && this.setState({
                    acceptMail: store.getState().rootReducer.reducer.changeUserData.send_notification_on_change_watched_entity
                })
            }
            if (!prevState.loaded && store.getState().rootReducer.reducer.changeUserDataFinish) {
                this.mounted && this.setState({
                    loaded: true
                })
            }
        }
        if(this.props.params.activeUser === undefined && store.getState().rootReducer.reducer.activeUser !== undefined && store.getState().rootReducer.reducer.activeUser.token === undefined) {
            this.props.history.push("/login")
        }
    }

    handleValidSubmit = (event, values) => {
        this.state.errors !== undefined && this.state.errors !== null && this.setState({errors: null});
        if(loadState("activeUser").activeUser === undefined || loadState("activeUser").activeUser.username === undefined || loadState("activeUser").activeUser.token === undefined) {
            this.props.history.push("/login");
        }
        else {
            store.dispatch(changeUserInfo(loadState("activeUser").activeUser.username, values.name, values.surname, values.email, values.acceptMail, loadState("activeUser").activeUser.token));
        }

    };

    componentWillUnmount() {
        this.mounted = false;
        try {
            this.unlisten();
        } catch (e) {
        }
    }

    changePassword = () => {
        this.openModal()
    };

    handleInvalidSubmit = (errors, values) => {
        this.setState({errors, values});
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

    handleChange = nextValue => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + nextValue + "/0/" + number_per_page)
    };

    render() {
        const { inputValue } = this.props;
        const defaultValues = {
            name: this.state.name,//store.getState().rootReducer.reducer.changeUserData.first_name,
            surname: this.state.surname,//store.getState().rootReducer.reducer.changeUserData.last_name,
            email: this.state.email,//store.getState().rootReducer.reducer.changeUserData.email,
            acceptMail: this.state.acceptMail,//store.getState().rootReducer.reducer.changeUserData.send_notification_on_change_watched_entity
        };
        return (
            this.state.loaded && this.mounted &&
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
                            {Lang.PERSONAL_DATA}
                        </h1>
                        <h2>
                            {Lang.PERSONAL_DATA_SUBTITLE}
                        </h2>
                    </div>
                </div>
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
                <div className="Login-div row">
                    <div className="Login-column col-sm-8">
                        <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit} model={defaultValues}>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Name">{Lang.PERSONAL_DATA_NAME}</Label>
                                <AvField
                                    type="text"
                                    name="name"
                                    id="Login-Name"
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Surname">{Lang.PERSONAL_DATA_LAST_NAME}</Label>
                                <AvField
                                    type="text"
                                    name="surname"
                                    id="Login-Surname"
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className={"Login-input-header"} for="Login-Email">{Lang.EMAIL}</Label>
                                <AvField
                                    type="email"
                                    name="email"
                                    id="Login-Email"
                                    validate={{
                                        email: {value: true, errorMessage: Lang.EMAIL_ERROR}
                                    }}
                                />
                            </AvGroup>
                            <AvGroup check>
                                <Label check className={"Login-input-header"}>
                                    <AvInput type="checkbox" name="acceptMail" id={"Login-Email-Accept"} /*defaultChecked={store.getState().rootReducer.reducer.changeUserData.send_notification_on_change_watched_entity}*/ /> {Lang.PERSONAL_DATA_WANT_TO_RECIEVE_EMAILS}
                                </Label>
                            </AvGroup>
                            <FormGroup>
                                <Button className={"Login-button-submit"} >{Lang.SAVE}</Button>
                            </FormGroup>
                        </AvForm>
                        <PersonalError/>
                    </div>
                </div>
                <div className="row empty-row d-none d-sm-block"></div>
                <div className="row empty-row d-none d-sm-block"></div>
                {this.state.showModal ? <ChangePassModal setModal={this.setModalShow} /> : null}
                <div className="Login-div PersonalPage Login-Button-div">
                    <Button className={"Login-change-pass"} onClick={() => this.changePassword()}>{Lang.PERSONAL_DATA_CHANGE_PASSWORD}</Button>
                </div>
            </div>
        )

    }
}
export default withWindowSizeListener(Personal);