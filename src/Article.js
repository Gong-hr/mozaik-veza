import React, {Component} from 'react'
import "./styles/Article.css"
import SanitizedHTML from 'react-sanitized-html'
import {store} from "./index"
import {getArticle, getArticleShort, searchAutocomplete} from "./actions"
import {allowedTags, allowedAttributes, number_per_page, ga_trackingID} from "./config"
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import { withWindowSizeListener } from 'react-window-size-listener'
import {SITE_NAME} from "./lang"
import PageNotFound from './PageNotFound'
import ReactGA from 'react-ga'

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: "",
            articleShort: ""
        }
    }
    componentWillMount() {
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }
    componentDidMount() {
        store.dispatch(getArticle(this.props.match.params.id));
        store.dispatch(getArticleShort(this.props.match.params.id));
        let art = "";

        this.unsubscribe = store.subscribe(() => {
            art = store.getState().rootReducer.reducer.article;
            let artShort = store.getState().rootReducer.reducer.articleShort;
            document.title = art.title !== undefined ? art.title : SITE_NAME;

            //art !== "" && console.log(this.parent.getElementsByTagName("a"))
            if(art.content_long !== undefined) {
                let new_art = {};
                new_art.content_long = art.content_long.replace(/<a /g,"<a target='_blank' ");
                new_art.title = art.title;
                new_art.slug = art.slug;
                this.setState({
                    article: new_art,
                    articleShort: artShort,
                });
            }
            else {
                this.setState({
                    article: art,
                    articleShort: artShort,
                })
            }
        });
        this.unsubscribe2 = store.subscribe(() => {
            let error = store.getState().rootReducer.reducer.error;
            let site_type = store.getState().rootReducer.reducer.site_type;
            if(error !== this.state.error || site_type !== this.state.site_type) {
                this.setState({
                    error: error,
                    site_type: site_type
                })
            }

        });
    }
    componentDidUpdate (prevProps, prevState) {
        if(prevProps.match.params.id !== this.props.match.params.id) {
            store.dispatch(getArticle(this.props.match.params.id));
            store.dispatch(getArticleShort(this.props.match.params.id));
            let art = store.getState().rootReducer.reducer.article;
            let artShort = store.getState().rootReducer.reducer.articleShort;
            if(art.content_long !== undefined) {
                let new_art = {};
                new_art.content_long = art.content_long.replace(/<a /g,"<a target='_blank' ");
                new_art.title = art.title;
                new_art.slug = art.slug;
                if(prevState.article !== this.state.article) {
                    this.setState({
                        article: new_art,
                    });
                }
                if(prevState.articleShort !== this.state.articleShort) {
                    this.setState({
                        articleShort: artShort,
                    });
                }
            }
            else {
                if(prevState.article !== this.state.article) {
                    this.setState({
                        article: art,
                    });
                }
                if(prevState.articleShort !== this.state.articleShort) {
                    this.setState({
                        articleShort: artShort,
                    });
                }
            }
            if(prevState.article.title !== undefined && art.title !== undefined && prevState.article.title !== art.title) {
                document.title = art.title !== undefined ? SITE_NAME + " - " + art.title : SITE_NAME;
            }
            else {
                document.title = SITE_NAME;
            }
            //this.parent.getElementsByTagName("a").style.target = "_blank";
            window.scrollTo(0, 0);
        }
    }
    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
            console.log(e)
        }
        try {
            this.unsubscribe2();
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
        const { title, content_long } = this.state.article;
        const { content_short } = this.state.articleShort;
        const { inputValue } = this.props;
        return (
            <div className="Article-container container" ref={(parent) => { this.parent = parent; }}>
                <div className="row Article-row">
                    <div className="col-lg-8 Article-left-column">
                        <div className={"Search-Field-header"}>
                            {this.props.windowSize.windowWidth < 1400 ?
                                <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                :
                                <SearchInput className={"d-none d-lg-block"} value={inputValue} onSubmit={this.handleChange}/>}
                            <SearchAutocomplete/>
                        </div>
                        {this.state.error !== undefined && this.state.site_type !== undefined && this.state.error !== null && this.state.site_type !== null && this.state.site_type === "article" ?
                            <PageNotFound page={"article"} id={this.props.match.params}/>
                            :
                            <div>
                                <h1>{title}</h1>
                                <div className={"Article-short"} /*dangerouslySetInnerHTML={{__html: content_short}}*/>
                                    <SanitizedHTML html={content_short} />
                                </div>
                                <div className={"Article-main"} /*dangerouslySetInnerHTML={{__html: content_long}}*/>
                                    {/*console.log(content_long)*/}
                                    <SanitizedHTML html={content_long} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="col-lg-4 Article-right-column">

                    </div>
                </div>
            </div>
        );
    }
}
export default withWindowSizeListener(Article);