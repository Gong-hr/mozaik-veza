import React, { Component } from 'react'
import "./styles/Connection.css"
import AboutShort from "./AboutShort"
import {store} from "./index"
import {ga_trackingID, number_per_page} from "./config"
import ConnectionAttributesData from './containers/connectionAttributesData'
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import {searchAutocomplete, deleteConnectionData} from "./actions"
import { withWindowSizeListener } from 'react-window-size-listener'
import {SITE_NAME, CONNECTION_SMALLCAPS} from "./lang"
import PageNotFound from './PageNotFound'
import ReactGA from 'react-ga'
//import ConnectionRelatedConnectionsData from "./containers/connectionRelatedConnectionsData"

class Connection extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        document.title = SITE_NAME + " - " + CONNECTION_SMALLCAPS + " "+this.props.match.params.id;
        window.scrollTo(0, 0);
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                error: store.getState().rootReducer.reducer.error,
                site_type: store.getState().rootReducer.reducer.site_type
            })
        });
    }
    componentWillMount() {
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }
    setEntity_A = (val) => {
        this.entity_a = val;
    };
    setEntityForRelatedConnections = val => {
        this.setEntity_A(val);
    };

    handleChange = nextValue => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + nextValue + "/0/" + number_per_page)
    };
    componentWillUnmount() {
        store.dispatch(deleteConnectionData());
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
    render() {
        const { inputValue } = this.props;
        return (
            <div className="Connection-container container">
                <div className="row Connection-row">
                    <div className="col-lg-8">
                        <div className={"Search-Field-header"}>
                            {this.props.windowSize.windowWidth < 1400 ?
                                <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                :
                                <SearchInput value={inputValue} onSubmit={this.handleChange}/>}
                            <SearchAutocomplete/>
                        </div>
                        {this.state.error !== undefined && this.state.site_type !== undefined && this.state.error !== null && this.state.site_type !== null && this.state.site_type === "connection" ?
                            <PageNotFound page={"connection"} id={this.props.match.params}/>
                            :
                            <ConnectionAttributesData params={this.props.match.params}
                                                       setEntity={this.setEntityForRelatedConnections}/>
                        }
                    </div>
                    <div className="col-lg-4 Connection-right-column">
                        <AboutShort />
                        <div className="Connection-right-column-inner-div-no-border">
                            {/*<!--
                            <div className="Connection-right-column-related">
                                <ConnectionRelatedConnectionsData params={[this.getEntity_A, this.props.match.params]}/>
                            </div>
                            -->*/}
                        </div>
                    </div>
                </div>
                <div className="row empty-row d-none d-md-block"></div>
                <div className="row empty-row d-none d-md-block"></div>
                <div className="row empty-row d-none d-md-block"></div>
                <div className="row empty-row d-none d-md-block"></div>
            </div>
        );
    }
}
export default withWindowSizeListener(Connection);

