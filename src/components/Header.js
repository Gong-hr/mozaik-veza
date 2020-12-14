import React, { Component } from 'react'
import {about_project, about_project_name} from '../config'
import logo from '../images/logo.svg'
import logoMobile from '../images/logo-mobile.svg'
import { store } from '../index'
import { loadState } from '../localStorage'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Collapse,
    Navbar,
    //NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap'
import * as Lang from "../lang"


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: loadState("activeUser") !== undefined && loadState("activeUser").activeUser !== undefined ? loadState("activeUser").activeUser.token : undefined,
            dropdownOpen: false,
            isOpen: false
        };
    }
    componentWillMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                loggedIn: store.getState().rootReducer.reducer.activeUser !== undefined && store.getState().rootReducer.reducer.activeUser.token
            })
        });
    }

    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    toggleNavbar = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    logout = () => {
        this.toggleNavbar();
        this.props.params.setLoggedIn();
    };

    render() {
        return <div className="App-Header" id="App-Header">
            <div className="container">
                <header className="row align-items-center">
                    <div className="col-xl-6 col-lg-3 col-sm-6 d-none d-lg-block">
                        <Link to={"/"} >
                            <img src={logo} className="float-left align-middle img-fluid App-logo"
                                 alt="logo"/>
                        </Link>
                    </div>
                    <div className="col-xl-3 col-lg-5 d-none d-lg-block">
                        <div className="App-Header-links pr-3 align-middle">
                            <ul style={{fontSize: "9px", listStyleType: "none"}}>
                                <li>
                                    {/*<a href={'/collection'} >{Lang.COLLECTION_SITE_NAME}</a>*/}
                                    <Link to={'/collection'}>{Lang.COLLECTION_SITE_NAME}</Link>
                                </li>
                                <li>
                                    {/*<a href={'/article/' + about_project} >{about_project_name}</a>*/}
                                    <Link to={'/article/' + about_project}>{about_project_name}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 offset-lg-0 offset-xl-0 d-none d-lg-block">
                        <div className="App-Header-profil" style={{display: this.state.loggedIn !== undefined ? "none" : "block"}}>
                            <Link to={"/signup"}>
                                <div id="Header-Button-SignUp">
                                    <span>{Lang.SIGN_UP_SITE_NAME}</span>
                                </div>
                            </Link>
                            <Link to={"/login"}>
                                <div id="Header-Button-Login">
                                    <span>{Lang.LOGIN_PAGE_NAME}</span>
                                </div>
                            </Link>
                            <div className="horizontal-line"></div>
                        </div>
                        <div className="App-Header-profil" style={{display: this.state.loggedIn !== undefined ? "block" : "none"}}>
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle caret>
                                    {Lang.PROFIL}&nbsp;<span><FontAwesomeIcon icon={"user"}/></span>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>
                                        <Link to={"/saved_entities"}>{Lang.MY_ENTITIES}</Link>
                                    </DropdownItem>
                                    <DropdownItem >
                                        <Link to={"/saved_searches"}>{Lang.MY_SAVED_SEARCH}</Link>
                                    </DropdownItem>
                                    <DropdownItem >
                                        <Link to={"/personal"}>{Lang.PERSONAL_DATA}</Link>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        <div onClick={() => this.props.params.setLoggedIn()} className={"logout-sm-button"} style={{display: this.state.loggedIn !== undefined && this.state.loggedIn !== undefined ? "block" : "none"}} title={Lang.LOGOUT}>
                                            {Lang.LOGOUT}&nbsp;&nbsp;<span><FontAwesomeIcon icon={"lock"}/></span>
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <span className="float-right align-middle pr-3"></span>
                            <div className="horizontal-line"></div>
                        </div>
                    </div>
                    <div className={"d-block d-lg-none col-12"}>
                        <Navbar color="light" light expand="lg" className={"fixed-top"}>
                            <NavbarBrand href="/" className="mr-auto">
                                <img src={logoMobile} className="App-logo-sm float-left align-middle img-fluid" alt="logo"/>
                            </NavbarBrand>
                            {/*
                            <div className={"Search-Field-header Search-Field-sm-header"}>
                                {window.location.pathname !== "/" ?
                                    <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                : null}
                                {window.location.pathname !== "/" ?
                                    <SearchAutocomplete />
                                : null}
                            </div>
                            <NavbarToggler onClick={this.toggleNavbar} style={{display: this.state.isOpen ? "none" : "block"}}/>
                            */}
                            <div onClick={this.toggleNavbar} className={"menuToggler"} style={{display: this.state.isOpen ? "none" : "block"}}>
                                <FontAwesomeIcon icon={"bars"}/>
                            </div>
                            <div onClick={this.toggleNavbar} className={"button-sm-close-navbar"} style={{display: !this.state.isOpen ? "none" : "block"}}>
                                <span>
                                    <FontAwesomeIcon icon={"times"}/>
                                </span>
                            </div>
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <Link to={'/collection'} onClick={this.toggleNavbar} >
                                            <div>{Lang.COLLECTION_SITE_NAME}</div>
                                        </Link>
                                    </NavItem>
                                    <NavItem>
                                        <Link to={'/article/' + about_project} onClick={this.toggleNavbar} >
                                            <div>{about_project_name}</div>
                                        </Link>
                                    </NavItem>
                                    <DropdownItem divider />
                                    {(this.state.loggedIn === undefined) &&
                                        <NavItem className={"signup-nav-item"}>
                                            <Link to={'/signup'} onClick={this.toggleNavbar} className={"signup"} >
                                                <div>{Lang.SIGN_UP_SITE_NAME}</div>
                                            </Link>
                                            <Link to={'/login'} onClick={this.toggleNavbar} className={"login"}>
                                            <div>{Lang.LOGIN_PAGE_NAME}</div>
                                        </Link>
                                        </NavItem>
                                    }
                                    {(this.state.loggedIn !== undefined) &&
                                        <div className={"navbar-sm-profile"}>{Lang.PROFIL.toUpperCase()}&nbsp;&nbsp;<span><FontAwesomeIcon icon={"user"}/></span></div>
                                    }
                                    {(this.state.loggedIn !== undefined) &&
                                        <NavItem>
                                            <Link to={"/saved_entities"} onClick={this.toggleNavbar}>
                                                <div>{Lang.MY_ENTITIES}</div>
                                            </Link>
                                        </NavItem>
                                    }
                                    {(this.state.loggedIn !== undefined) &&
                                        <NavItem>
                                            <Link to={"/saved_searches"} onClick={this.toggleNavbar}>
                                                <div>{Lang.MY_SAVED_SEARCH}</div>
                                            </Link>
                                        </NavItem>
                                    }
                                    {(this.state.loggedIn !== undefined) &&
                                        <NavItem>
                                            <Link to={"/personal"} onClick={this.toggleNavbar}>
                                                <div>{Lang.PERSONAL_DATA}</div>
                                            </Link>
                                        </NavItem>
                                    }
                                    {(this.state.loggedIn !== undefined) &&
                                        <NavItem>
                                            <div onClick={this.logout} className={"logout-sm-button"} style={{display: this.state.loggedIn !== undefined && this.state.loggedIn !== undefined ? "block" : "none"}} title={Lang.LOGOUT}>
                                                {Lang.LOGOUT}&nbsp;&nbsp;<span><FontAwesomeIcon icon={"lock"}/></span>
                                            </div>
                                        </NavItem>
                                    }
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                </header>
            </div>
        </div>
    }
}