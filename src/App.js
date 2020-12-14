import React, {Component} from 'react'
//import {connect} from 'react-redux'
import './styles/App.css'
import './styles/Router.css'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import '@fortawesome/fontawesome-free-solid'
import '@fortawesome/fontawesome-free-regular'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ScrollToTop from './ScrollToTop'
import Home from './Home'
import Entity from './Entity'
import SearchPage from './SearchPage'
import Collection from './Collection'
import Connection from './Connection'
import Filter from './Filter'
import FilterConnections from './FilterConnections'
import Login from './Login'
import SignUp from './SignUp'
import Article from './Article'
import HeaderData from './containers/headerData'
import SaveEntities from './SaveEntities'
import SavedSearch from './SavedSearch'
import Personal from './Personal'
import VerifyEmail from './VerifyEmail'
import UserPasswordToken from './UserPasswordToken'
import PageNotFound from './PageNotFound'
import { store, persistedState } from "./index"
import { Provider } from 'react-redux'
import { privacy, terms, bug_link, contact_mail } from './config'
import {loadState, saveState} from "./localStorage"
import {updateActiveUser} from "./actions"
import eu from './images/eu.jpg'
import centri from './images/centri.png'
import zaklada from './images/zaklada.png'
import us from './images/us.png'
import LoadingBar from 'react-redux-loading-bar'
import * as Lang from "./lang"

const RouteWithProps = ({path, exact, strict, component: Component, location, ...rest}) => (
    <Route
        path={path}
        exact={exact}
        strict={strict}
        location={location}
        render={(props) => <Component {...props} {...rest} />}
    />
);

class ScrollButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalId: 0,
        };
    }

    scrollStep() {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }

    scrollToTop() {
        let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
        this.setState({intervalId: intervalId});
    }

    render() {
        return <button title='Back to top' className='scroll'
                       onClick={() => {
                           this.scrollToTop();
                       }}>
            <span>{Lang.BACKTOTOP}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={"font-awesome-holder"}><FontAwesomeIcon icon="angle-up"/></span>
        </button>;
    }
}

const Footer = props => (
    <div className="App-Footer" id={"App-Footer"}>
        <div className="container">
            <footer className="row">
                <div className="col-12 footer-links-col">
                    <div className="footer-logo footer-links d-none d-md-block">
                        <a href={"https://creativecommons.org/licenses/by-nd/4.0/deed.hr"} target={"_blank"}>
                            {Lang.CREATIVE_COMMONS}
                        </a>
                        <Link to={"/article/" + terms}>
                            {Lang.TEARM_OF_USE}
                        </Link>&nbsp;
                        <Link to={"/article/" + privacy}>
                            {Lang.PRIVACY_POLICY}
                        </Link>
                        <a href={bug_link} target={"_blank"}>
                            {Lang.REPORT_ERROR}
                        </a>&nbsp;
                        <a href={"mailto:"+contact_mail} target={"_blank"}>
                            {Lang.CONTACT}
                        </a>
                    </div>
                    <div className="footer-back-to-top">
                        {/*props.scrollToTop ? */<ScrollButton scrollStepInPx={50} delayInMs={16.66}/>/* : ""*/}
                    </div>
                    <div className="footer-logo footer-links d-block d-md-none">
                        <a href={"https://creativecommons.org/licenses/by-nd/4.0/deed.hr"} target={"_blank"}>
                            {Lang.CREATIVE_COMMONS}
                        </a>
                    </div>
                    <div className="footer-logo footer-links d-block d-md-none">
                        <Link to={"/article/" + terms}>
                            {Lang.TEARM_OF_USE}
                        </Link>&nbsp;
                        <Link to={"/article/" + privacy}>
                            {Lang.PRIVACY_POLICY}
                        </Link>
                    </div>
                    <div className="footer-logo footer-links d-block d-md-none">
                        <a href={bug_link} target={"_blank"}>
                            {Lang.REPORT_ERROR}
                        </a>&nbsp;
                        <a href={"mailto:"+contact_mail} target={"_blank"}>
                            {Lang.CONTACT}
                        </a>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 eu">
                    <div className={"eu-img"}>
                        <img src={us} className="img-fluid" alt="logo"/>
                        <img src={eu} className="img-fluid" alt="logo"/>
                        <span>{Lang.EU}</span>
                    </div>
                </div>
                <div className={"col-xl-9 col-lg-8 col-md-7 eu-text"} style={{marginTop: "12px"}}>
                    {Lang.GOOGLE_PART1} <a target={"_blank"} href="https://newsinitiative.withgoogle.com/dnifund/">Digital News Innovation Fund-a</a>, <a target={"_blank"} href={"https://www.ned.org/"}>National Endowment for Democracy</a>, {Lang.GOOGLE_PART2} <a target={"_blank"} href="http://europazagradane.hr/">Europa za građane</a> {Lang.GOOGLE_PART3} <a target={"_blank"} href="https://zaklada.civilnodrustvo.hr/razvojna-suradnja/centri-znanja">Centri znanja</a> {Lang.AND} <a target={"_blank"} href="https://hr.usembassy.gov/hr/">{Lang.US_EMBASSY}</a>.
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 gong">
                    <div className={"gong-img"}>
                        <img src={zaklada} className="img-fluid" alt="logo"/>
                        <img src={centri} className="img-fluid" alt="logo"/>
                    </div>
                </div>
                <div className={"col-xl-9 col-lg-8 col-md-7 eu-text"} style={{marginTop: "12px"}}>
                    <a target={"_blank"} href="http://gong.hr">GONG</a> {Lang.GONG}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 gong">
                    <div className={"gong-img"}>
                    </div>
                </div>
                <div className={"col-12 development"}>
                    <div className={"footer-links"} style={{fontSize: "10px"}}>
                        developed&nbsp;by&nbsp;<a href={"http://abacusstudio.hr"} target={"_blank"}>Abacus&nbsp;Studio</a>
                    </div>
                </div>
            </footer>
        </div>
    </div>
);


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heightDocument: 0,
            heightWindow: 0,
            showScrollToTop: false,
            userLogged: "",
            //error: null
        };
        //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    /*componentWillMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                error: store.getState().rootReducer.reducer.error
            })
        });
    }*/

    componentDidMount() {
        this.setState({
            userLogged: loadState("activeUser")
        });
        /*this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('mousedown', this.updateWindowDimensions);
        document.body.scrollHeight > window.innerHeight ? this.setState({
            heightDocument: document.body.scrollHeight,
            heightWindow: window.innerHeight,
            showScrollToTop: true
        }) : this.setState({
            heightDocument: document.body.scrollHeight,
            heightWindow: window.innerHeight,
            showScrollToTop: false
        });
        setTimeout(() => {
            document.body.scrollHeight > window.innerHeight ? this.setState({
                heightDocument: document.body.scrollHeight,
                heightWindow: window.innerHeight,
                showScrollToTop: true
            }) : this.setState({
                heightDocument: document.body.scrollHeight,
                heightWindow: window.innerHeight,
                showScrollToTop: false
            });
        }, 3000);*/
    }

    componentWillUnmount() {
        //window.removeEventListener('resize', this.updateWindowDimensions);
        //window.removeEventListener('mousedown', this.updateWindowDimensions);
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    /*updateWindowDimensions() {
        setTimeout(() => {
            document.body.scrollHeight > window.innerHeight ? this.setState({
                heightDocument: document.body.scrollHeight,
                heightWindow: window.innerHeight,
                showScrollToTop: true
            }) : this.setState({
                heightDocument: document.body.scrollHeight,
                heightWindow: window.innerHeight,
                showScrollToTop: false
            });
        }, 3000);
    }*/

    logout = () => {
        this.setState({
            userLogged: ""
        });
        saveState({
            activeUser: undefined
        });
        store.dispatch(updateActiveUser());
    };



    render() {
        return (
            <Provider store={store}>
                <Router>
                    <ScrollToTop>
                        <div className="App">
                            <HeaderData setLoggedIn={() => this.logout()}/>
                            <div id="center-div" className="">
                                <LoadingBar className={"LoadingBar"} showFastActions />
                                <Switch>
                                    <RouteWithProps exact path='/' component={Home}/>
                                    <RouteWithProps path='/entity/:id' component={Entity} params={persistedState}/>
                                    <RouteWithProps exact path='/search/:term/:offset/:limit' component={SearchPage}/>
                                    <RouteWithProps exact path='/connection/:id' component={Connection}/>
                                    <RouteWithProps exact path='/collection' component={Collection}/>
                                    <RouteWithProps exact path='/login' component={Login}/>
                                    <RouteWithProps exact path='/signup' component={SignUp}/>
                                    <RouteWithProps exact path='/filter/:id' component={Filter}/>
                                    <RouteWithProps exact path='/filter/' component={FilterConnections}/>
                                    <RouteWithProps exact path='/article/:id' component={Article}/>
                                    <RouteWithProps exact path='/saved_entities' component={SaveEntities} params={persistedState}/>
                                    <RouteWithProps exact path='/saved_searches' component={SavedSearch} params={persistedState}/>
                                    <RouteWithProps exact path='/personal' component={Personal} params={this.state.userLogged}/>
                                    <RouteWithProps exact path='/verify_email/:user/:token' component={VerifyEmail}/>
                                    <RouteWithProps exact path='/user_password_token/:user/:token' component={UserPasswordToken}/>
                                    <Route component={PageNotFound} />
                                </Switch>
                            </div>
                            <Footer scrollToTop={this.state.showScrollToTop}/>
                        </div>
                    </ScrollToTop>
                </Router>
            </Provider>
        );
    }
}

export default App;
//export default withRouter(App);
