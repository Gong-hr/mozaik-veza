import React, {Component} from 'react'
import "./styles/Home.css"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import image1 from './images/1.png'
import image2 from './images/2.png'
import image3 from './images/3.png'
import SearchInput from './components/SearchInput'
import HomePageVideoModal from './components/HomePageVideoModal'
import SearchAutocomplete from './containers/searchAutocomplete'
import {store} from "./index"
import {
    number_per_page,
    about_project,
    home_top,
    home_first,
    home_second,
    home_third,
    home_person_slug,
    allowedAttributes,
    allowedTags,
    entity_first,
    entity_first_name,
    entity_second,
    entity_second_name, ga_trackingID
} from "./config"
import SanitizedHTML from 'react-sanitized-html'
import {getArticleShort, searchAutocomplete} from "./actions"
import * as Lang from "./lang"
import ReactGA from 'react-ga'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleShortAbout: "",
            articleShort1: "",
            articleShort2: "",
            articleShort3: "",
            articleShort4: "",
            //showModal: false,
            showVideo: false,
            video: null,
        };
    }
    //i = 0;
    componentWillMount() {
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }

    componentDidMount() {
        //this.i === 0 && this.openModal();
        //this.i++;
        store.dispatch(getArticleShort(about_project));
        this.unsubscribe = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.articleShort!== undefined && store.getState().rootReducer.reducer.articleShort.slug === about_project) {
                let artShortAbout = store.getState().rootReducer.reducer.articleShort;
                this.setState({
                    articleShortAbout: artShortAbout,
                })
            }
        });
        store.dispatch(getArticleShort(home_top));
        this.unsubscribe2 = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.articleShort!== undefined && store.getState().rootReducer.reducer.articleShort.slug === home_top) {
                let artShort1 = store.getState().rootReducer.reducer.articleShort;
                this.setState({
                    articleShort1: artShort1,
                })
            }
        });
        store.dispatch(getArticleShort(home_first));
        this.unsubscribe3 = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.articleShort!== undefined && store.getState().rootReducer.reducer.articleShort.slug === home_first) {
                let artShort2 = store.getState().rootReducer.reducer.articleShort;
                this.setState({
                    articleShort2: artShort2,
                })
            }
        });
        store.dispatch(getArticleShort(home_second));
        this.unsubscribe4 = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.articleShort!== undefined && store.getState().rootReducer.reducer.articleShort.slug === home_second) {
                let artShort3 = store.getState().rootReducer.reducer.articleShort;
                this.setState({
                    articleShort3: artShort3,
                })
            }
        });
        store.dispatch(getArticleShort(home_third));
        this.unsubscribe5 = store.subscribe(() => {
            if(store.getState().rootReducer.reducer.articleShort!== undefined && store.getState().rootReducer.reducer.articleShort.slug === home_third) {
                let artShort4 = store.getState().rootReducer.reducer.articleShort;
                this.setState({
                    articleShort4: artShort4,
                })
            }
        });
        window.scrollTo(0, 0);
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
            this.unsubscribe3();
        } catch (e) {
            console.log(e)
        }
        try {
            this.unsubscribe4();
        } catch (e) {
            console.log(e)
        }
        try {
            this.unsubscribe5();
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
    setShowVideo = (e) => {
        this.setState({
            showVideo: e
        });
        if(e.target !== undefined) {
            this.setState({
                video: e.target.id
            })
        }
    };

    render() {
        const { inputValue } = this.props;
        const titleAbout = this.state.articleShortAbout.title;
        const content_short_about = this.state.articleShortAbout.content_short;
        const title_1 = this.state.articleShort1.title;
        const content_short_1 = this.state.articleShort1.content_short;
        const title_2 = this.state.articleShort2.title;
        const content_short_2 = this.state.articleShort2.content_short;
        const title_3 = this.state.articleShort3.title;
        const content_short_3 = this.state.articleShort3.content_short;
        const title_4 = this.state.articleShort4.title;
        const content_short_4 = this.state.articleShort4.content_short;
        return (
            <div>
                <div style={{display: "none"}} className={"Header-div"}><Link to={'/about'} activestyle={{color: '#e0303e'}} >{Lang.ABOUT_PROJECT_SITE_NAME}</Link></div>
                <div className="Home-container Home-container-yellow">
                    <div className="container">
                        <div className="row Home-row Home-search-row">
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                <h1>{title_1}</h1>
                            </div>
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                {/*<h3>{content_short_1}</h3>*/}
                                <div className={"Home-h3"} /*dangerouslySetInnerHTML={{__html: content_short_1}}*/>
                                    <SanitizedHTML html={content_short_1} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                </div>
                            </div>
                            <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                                <div className="search-block">
                                    <SearchInput value={inputValue} onSubmit={this.handleChange}/>
                                    <SearchAutocomplete/>
                                </div>
                            </div>
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                <div className="Home-search-common">
                                    <p className="Home-search-common-p-red">
                                        <Link to={"/filter/"}>{Lang.FILTER_CONNECTIONS_SITE_NAME}<FontAwesomeIcon icon="sliders-h"/></Link>
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2" style={{display: "none"}}>
                                <div className="Home-search-common">
                                    <p>{Lang.HOME_PAGE_WHAT_PEOPLE_OFTEN_SEARCH}</p>
                                    <p className="Home-search-common-p-red">
                                        <Link to={"/entity/"+entity_first}>{entity_first_name}</Link>, <Link to={"/entity/"+entity_second}>{entity_second_name}</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Home-container Home-container-gray">
                    <div className="container">
                        <div className="row Home-row Home-about-row">
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                <h1>{titleAbout}</h1>
                            </div>
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                <div className={"Home-h3"} /*dangerouslySetInnerHTML={{__html: content_short_about}}*/>
                                    <SanitizedHTML className={"Home-h3-div"} html={content_short_about} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                </div>
                            </div>
                            <div className={"col-md-10 offset-md-1 col-lg-8 offset-lg-2 Home-about-row-videos"}>
                                <div className={"Home-about-row-videos-div"}>
                                    <div onClick={this.setShowVideo} id={"aboutVideo"} className={"Home-about-row-videos-about"}>
                                        {Lang.HOME_PAGE_START_FIRST_VIDEO}&nbsp;&nbsp;<span><FontAwesomeIcon icon={['far', 'play-circle']}/></span>
                                    </div>
                                    <div onClick={this.setShowVideo} id={"howToVideo"} className={"Home-about-row-videos-howTo"}>
                                        {Lang.HOME_PAGE_START_SECOND_VIDEO}&nbsp;&nbsp;<span><FontAwesomeIcon icon={['far', 'play-circle']}/></span>
                                    </div>
                                </div>
                                <hr></hr>
                            </div>
                            <div className="col-md-4">
                                <Link to={"/filter/"}>
                                    <img src={image2} className="img-fluid" alt="logo"/>
                                    <h2>{title_2}</h2>
                                    <div className={"Home-image-text"} /*dangerouslySetInnerHTML={{__html: content_short_2}}*/>
                                        <SanitizedHTML html={content_short_2} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to={"/entity/"+home_person_slug}>
                                    <img src={image1} className="img-fluid" alt="logo"/>
                                    <h2>{title_3}</h2>
                                    <div className={"Home-image-text"} /*dangerouslySetInnerHTML={{__html: content_short_3}}*/>
                                        <SanitizedHTML html={content_short_3} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to={"/filter/"+home_person_slug}>
                                    <img src={image3} className="img-fluid" alt="logo"/>
                                    <h2>{title_4}</h2>
                                    <div className={"Home-image-text"} /*dangerouslySetInnerHTML={{__html: content_short_4}}*/>
                                        <SanitizedHTML html={content_short_4} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                                    </div>
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Home-container" style={{display: "none"}}>
                    <div className="container">
                        <div className="row Home-row Home-howto-row">
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                <h2>{Lang.HOME_PAGE_HOWTO_SUBTITLE}</h2>
                            </div>
                            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                                <h3>{Lang.HOME_PAGE_HOWTO_SUB_SUBTITLE}</h3>
                            </div>
                            <div className="col-md-12 offset-md-0 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                                <p className="Home-howto-example"><b>Popis donacija</b> koje premijer <b>primio</b> u
                                    proteklih 4 godine<span className="long-arrow-right"><FontAwesomeIcon
                                        icon="long-arrow-alt-right"/></span></p>
                                <p className="Home-howto-example"><b>Popis imovine</b> koju je
                                    predsjenica <b>stekla</b> otkad je na poziciji<span
                                        className="long-arrow-right"><FontAwesomeIcon
                                        icon="long-arrow-alt-right"/></span></p>
                                <p className="Home-howto-example"><b>Sve tvrtke</b> koje su direktno povezane sa <b>vladajućom
                                    koalicijom</b><span className="long-arrow-right"><FontAwesomeIcon
                                    icon="long-arrow-alt-right"/></span></p>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showVideo ? <HomePageVideoModal key={this.state.video} setModal={this.setShowVideo} params={this.state.video}/> : null}
            </div>
        );
    }
}

export default Home;