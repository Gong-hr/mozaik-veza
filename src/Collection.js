import React, { Component } from 'react'
import "./styles/Collection.css"
import { Collapse, Button, CardBody, Card } from 'reactstrap'
import { store } from "./index"
import {allowedAttributes, allowedTags, ga_trackingID, number_per_page, sources} from "./config"
import {getArticleShort, getSources, searchAutocomplete} from "./actions"
import SanitizedHTML from 'react-sanitized-html'
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import { withWindowSizeListener } from 'react-window-size-listener'
import * as Lang from "./lang"
import ReactGA from 'react-ga'

class Collection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: 0,
            articleShort: "",
            sources: [],
            total:0
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
        document.title = Lang.SITE_NAME + " - " + Lang.COLLECTION_SITE_NAME;
            //this.props.refresh();
        store.dispatch(getArticleShort(sources));
        store.dispatch(getSources());
        this.unsubscribe = store.subscribe(() => {
            let artShort = store.getState().rootReducer.reducer.articleShort;
            let sources = store.getState().rootReducer.reducer.sources !== undefined && store.getState().rootReducer.reducer.sources.results;
            if(store.getState().rootReducer.reducer.sources !== undefined && store.getState().rootReducer.reducer.sources.count > 10000) {
                this.setState({
                    total: store.getState().rootReducer.reducer.sources.count
                })
            }
            this.setState({
                articleShort: artShort,
                sources: sources,
            })
        });
        if(this.props.location.hash !== ""){
            if(this.state.collapse !== this.props.location.hash.substring(1)) {
                this.setState({
                    collapse: this.props.location.hash.substring(1)
                })
            }

        }
        window.scrollTo(0, 0);
    }

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

    formatDate = (time) => {
        if (time !== undefined && time !== null) {
            const tmp_date = time !== null && new Date(time);
            const tmp_day = tmp_date.getDate();
            const tmp_month = tmp_date.getMonth() + 1;
            const tmp_year = tmp_date.getFullYear();
            return tmp_day + ". " + tmp_month + ". " + tmp_year + ".";
        }
        else {
            return "";
        }
    };

    toggle = (e) => {
        if(this.state.collapse === e) {
            this.setState({collapse: 0})
        }
        else {
            this.setState({collapse: e})
        }
    };

    handleChange = nextValue => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + nextValue + "/0/" + number_per_page)
    };

    render() {
        const { title, content_short } = this.state.articleShort;
        const sources = this.state.sources;
        const { inputValue } = this.props;

        const sourcesList = <div>
            {sources !== undefined && sources.map((item, index) => {
                return <div key={index} className={" Collection-Collapse row"}>
                    <div className="Collection-column col-lg-8" id={item.string_id}>
                        <Button onClick={() => this.toggle(item.string_id)} className={"Collection-collapse-button"}>{item.name}</Button>
                        <Collapse isOpen={ this.state.collapse === (item.string_id) ? true : false }>
                            <Card>
                                <CardBody>
                                    <p>{Lang.COLLECTION_LAST_CHANGE}: {this.formatDate(item.last_in_log)}</p>
                                    { item.description !== null && <div>{Lang.COLLECTION_DESCRIPTION}: <div className={""} /*dangerouslySetInnerHTML={{__html: item.description}}*/>
                                        <SanitizedHTML html={item.description} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                    </div></div> }
                                    { item.collections.map((itemColl, indexColl) => {
                                        return <div key={indexColl} className={"Collection-Collapse-collection-div"} id={itemColl.string_id}>
                                            <hr/>
                                            <h2>{itemColl.name}</h2>
                                            { itemColl.collection_type.name !== null && <p>{Lang.COLLECTION_TYPE}: {itemColl.collection_type.name}</p> }
                                            <p>{Lang.COLLECTION_LAST_CHANGE}: {this.formatDate(itemColl.last_in_log)}</p>
                                            { itemColl.description !== null && <div>{Lang.COLLECTION_DESCRIPTION}: <div className={""} /*dangerouslySetInnerHTML={{__html: itemColl.description}}*/>
                                                <SanitizedHTML html={itemColl.description} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                            </div></div> }
                                        </div>
                                    })}
                                </CardBody>
                            </Card>
                        </Collapse>
                    </div>
                </div>
            })
            }
        </div>;
        return (
            <div className={"Collection-container container"}>
                <div className="Collection-div row">
                    <div className="Collection-column col-lg-8">
                        <div className={"Search-Field-header"}>
                            {this.props.windowSize.windowWidth < 1400 ?
                                <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                :
                                <SearchInput className={"d-none d-lg-block"} value={inputValue} onSubmit={this.handleChange}/>}
                            <SearchAutocomplete/>
                        </div>
                        <h1>
                            {title}
                        </h1>
                        <div className={"Collection-h2"} /*dangerouslySetInnerHTML={{__html: content_short}}*/>
                            <SanitizedHTML html={content_short} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                        </div>
                    </div>
                </div>
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
                {sourcesList}
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
                {this.state.total > 10000 ? "MORE" : ""}
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
            </div>
        );
    }
}

export default withWindowSizeListener(Collection);