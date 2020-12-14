import React, {Component} from 'react'
import "./styles/Search.css"
import { store} from "./index"
import {ga_trackingID, number_per_page} from "./config"
import {searchAutocomplete, search} from "./actions"
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import SearchAutocomplete from './containers/searchAutocomplete'
import Search from './containers/search'
import { withWindowSizeListener } from 'react-window-size-listener'
import * as Lang from "./lang"
import ReactGA from 'react-ga'

class SearchPage extends Component {

    componentWillMount() {
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }

    componentDidMount() {
        document.title = Lang.SITE_NAME + " - " + Lang.SEARCH_PAGE_NAME;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.term !== this.props.match.params.term) {
            store.dispatch(searchAutocomplete(''));
            window.scrollTo(0, 0);
        }
    }

    componentWillUnmount() {
        try {
            this.unlisten();
        } catch (e) {
            console.log(e)
        }
    }

    handleChange = e => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + e + "/0/" + number_per_page)
    };

    handleLimitChange = (term, offset, limit) => {
        store.dispatch(search(term, offset, limit));
        this.props.history.push("/search/" + term + "/" + offset + "/" + limit)
    };

    render() {
        const { inputValue } = this.props;
        return (
            <div>
                <div className="Search-container container">
                    <div className="row Search-row">
                        <div className="col-md-10 col-lg-8">
                            <div className={"Search-Field-header"}>
                                {this.props.windowSize.windowWidth < 1400 ?
                                    <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                    :
                                    <SearchInput className={"d-none d-xl-block"} value={inputValue} onSubmit={this.handleChange}/>}
                                <SearchAutocomplete/>
                            </div>
                            <div className={"Search-container-h1-div"}>
                                <h1>
                                    {Lang.SEARCH_PAGE_NAME}
                                </h1>
                                <Search params={this.props.match.params} handleLimitChange={this.handleLimitChange}/>
                            </div>
                            <div className="row empty-row"></div>
                            <div className="row empty-row"></div>
                            <div className="row empty-row"></div>
                        </div>
                        <div className="col-md-4">
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default withWindowSizeListener(SearchPage);