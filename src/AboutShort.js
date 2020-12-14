import React, {Component} from 'react'
import "./styles/AboutShort.css"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import {store} from "./index"
import { getArticleShort, statistics} from "./actions"
import {about_project, allowedAttributes, allowedTags} from "./config"
import SanitizedHTML from 'react-sanitized-html'
import * as Lang from "./lang"

class AboutShort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleShort: ""
        }
    }
    componentDidMount() {
        //this.props.refresh();
        store.dispatch(getArticleShort(about_project));
        store.dispatch(statistics());
        if(store.getState().rootReducer.reducer.article !== undefined) {

        }
        this.unsubscribe = store.subscribe(() => {
            let artShort = store.getState().rootReducer.reducer.articleShort;
            let statistics = store.getState().rootReducer.reducer.statistics.result;
            this.setState({
                articleShort: artShort,
                statistics: statistics,
            })
        });
    }
    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    render() {
        const { title, content_short } = this.state.articleShort;
        return (
            <div className="Entity-right-column-inner-div">
                <div className="Entity-right-column-about">
                    <h1>
                        {title}
                        <span className="float-right"><FontAwesomeIcon icon={"pencil-alt"}/></span>
                    </h1>
                    <div className={"Article-short"} /*dangerouslySetInnerHTML={{__html: content_short}}*/>
                        <SanitizedHTML html={content_short} allowedTags={allowedTags} allowedAttributes={allowedAttributes} />
                    </div>
                    <div className={"statistics mt-2"}>
                        <div className={"statistics-item"}>
                            <div className={"statistics-icon"}><FontAwesomeIcon icon={"arrows-alt-h"}/></div>
                            <div className={"statistics-text"}>{this.state.statistics !== undefined && this.state.statistics.connections_count.toLocaleString('fr-FR', {maximumFractionDigits: 0})}<br/><span>{Lang.CONNECTION_SMALLCAPS}</span></div>
                        </div>
                        <div className={"statistics-item"}>
                            <div className={"statistics-icon"}><FontAwesomeIcon icon={"male"}/></div>
                            <div className={"statistics-text"}>{this.state.statistics !== undefined && this.state.statistics.entities_count.person.toLocaleString('fr-FR', {maximumFractionDigits: 0})}<br/><span>{Lang.ABOUTSHORT_PERSONS}</span></div>
                        </div>
                        <div className={"statistics-item"}>
                            <div className={"statistics-icon"}><FontAwesomeIcon icon={"building"}/></div>
                            <div className={"statistics-text"}>{this.state.statistics !== undefined && this.state.statistics.entities_count.legal_entity.toLocaleString('fr-FR', {maximumFractionDigits: 0})}<br/><span>{Lang.ABOUTSHORT_LEGAL}</span></div>
                        </div>
                    </div>
                    <div className="Entity-right-column-about-link">
                        <Link to={"/article/"+about_project}>
                            {Lang.ABOUTSHORT_READ_MORE} <span><FontAwesomeIcon icon={"long-arrow-alt-right"}/></span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
export default AboutShort;