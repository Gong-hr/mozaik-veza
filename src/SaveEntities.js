import React, {Component} from 'react'
import { store } from "./index"
import {search, searchAutocomplete } from "./actions"
import {ga_trackingID, number_per_page} from "./config";
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import SearchAutocomplete from './containers/searchAutocomplete'
import SavedEntitiesData from './containers/savedEntitiesData'
import { loadState } from "./localStorage"
import { withWindowSizeListener } from 'react-window-size-listener'
import * as Lang from "./lang"
import ReactGA from 'react-ga'

class SaveEntities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: loadState("activeUser") !== undefined ? loadState("activeUser").activeUser.token : undefined,
            //followedEntities: []
        };
    }

    componentWillMount() {
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }

    componentDidMount() {
        document.title = Lang.SITE_NAME + " - " + Lang.PERSONAL_PAGE_NAME;
        if(loadState("activeUser") === undefined || loadState("activeUser").activeUser.token === undefined) {
            this.props.history.push("/login");
        }
        window.scrollTo(0, 0);
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                loggedIn: store.getState().rootReducer.reducer.activeUser.token
            })
        });
    }

    handleChange = e => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + e + "/0/" + number_per_page)
    };
    handleLimitChange = (term, offset, limit) => {
        store.dispatch(search(term, offset, limit));
        this.props.history.push("/search/" + term + "/" + offset + "/" + limit)
    };

    componentWillUnmount() {
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
    render() {
        const { inputValue } = this.props;
        return (
            //loadState("activeUser").activeUser.token !== undefined &&
            <div>
                <div className="Search-container container">
                    {this.state.loggedIn ?
                        <div className="row Search-row">
                            <div className="col-md-10 col-lg-8">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className={"Search-Field-header"}>
                                            {this.props.windowSize.windowWidth < 1400 ?
                                                <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                                :
                                                <SearchInput className={"d-none d-lg-block"} value={inputValue}
                                                             onSubmit={this.handleChange}/>}
                                            <SearchAutocomplete/>
                                        </div>
                                        <h1>
                                            {Lang.SAVED_ENTITIES}
                                        </h1>
                                        <h2 style={{display: "none"}}>
                                            {Lang.SAVED_ENTITIES_SUBTITLE}
                                        </h2>
                                    </div>
                                </div>
                                <SavedEntitiesData loggedIn={loadState("activeUser")}/>
                                <div className="row empty-row"></div>
                                <div className="row empty-row"></div>
                            </div>
                            <div className="col-md-4">
                            </div>
                        </div>
                        : this.props.history.push("/login")
                    }
                </div>
            </div>
        )
    }
}
export default withWindowSizeListener(SaveEntities);