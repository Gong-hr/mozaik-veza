import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {PAGE_NOT_FOUND, HOME_PAGE, PAGE_NOT_FOUND_ARTICLE, PAGE_NOT_FOUND_ENTITY, PAGE_NOT_FOUND_CONNECTION } from "./lang"
import ReactGA from 'react-ga'
import {ga_trackingID} from "./config";

export default class PageNotFound extends Component {
    componentWillMount() {
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }
    componentWillUnmount() {
        try {
            this.unlisten();
        } catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <div className={"page404"}>
                <h2>{
                    this.props.page === "connection" ?
                        PAGE_NOT_FOUND_CONNECTION
                        : this.props.page === "entity" ?
                        PAGE_NOT_FOUND_ENTITY
                            : this.props.page === "article" ?
                            PAGE_NOT_FOUND_ARTICLE
                                : PAGE_NOT_FOUND

                }
                </h2>
                {this.props.page === undefined &&
                    <Link to={"/"}><h3>{HOME_PAGE}</h3></Link>
                }
            </div>
        )
    }
}