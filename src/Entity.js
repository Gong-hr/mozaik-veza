import React, {Component} from 'react'
import "./styles/Entity.css"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import AboutShort from "./AboutShort"
import {
    entityConnections,
    followEntity,
    searchAutocomplete,
    updateEntityData,
    updateEntityConnectionsData} from "./actions"
import { Link } from 'react-router-dom'
import EntityConnectionsData from './containers/entityConnectionsData'
import EntityData from './containers/entityData'
import EntityRelatedEntitiesData from "./containers/entityRelatedEntitiesData"
import SearchAutocomplete from './containers/searchAutocomplete'
import SearchInput from './components/SearchInput'
import SearchInputHeader from './components/SearchInputHeader'
import { store } from "./index"
import {ga_trackingID, number_per_page} from "./config"
import { loadState } from "./localStorage"
import { withWindowSizeListener } from 'react-window-size-listener'
import {START_FILTER} from "./lang"
import PageNotFound from './PageNotFound'
import ReactGA from 'react-ga'
//import { showLoading, hideLoading } from 'react-redux-loading-bar'

class Entity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: "",
            order_by: "valid_to",
            order_direction: "desc",
            loggedIn: ""
        }
    }

    componentWillMount() {
        document.title = this.props.match.params.id;
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
        const tmp_array = this.props.location.search.split("&");
        tmp_array.map((item) => {
            let tmp_array2 = item.split("=");
            if(tmp_array2[0] === "connection_type_category" || tmp_array2[0] === "?connection_type_category") {
                this.setState({filter: tmp_array2[1]})
            }
            if(tmp_array2[0] === "order_by" || tmp_array2[0] === "?order_by") {
                this.setState({order_by: tmp_array2[1]})
            }
            if(tmp_array2[0] === "order_direction" || tmp_array2[0] === "?order_direction") {
                this.setState({order_direction: tmp_array2[1]})
            }
            return item;
        });
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                loggedIn: loadState("activeUser") !== undefined ? loadState("activeUser") : "",
                error: store.getState().rootReducer.reducer.error,
                site_type: store.getState().rootReducer.reducer.site_type
            })
        });
    }
    componentDidUpdate(prevProps) {
        if(prevProps.match.params.id !== this.props.match.params.id) {
            if(this.state.filter !== "" && this.props.location.search === ""){
                this.setState({
                    filter: ""
                })
            }
            if(this.state.order_by !== "" && this.props.location.search === ""){
                this.setState({
                    order_by: ""
                })
            }
            if(this.state.order_direction !== "" && this.props.location.search === ""){
                this.setState({
                    order_direction: ""
                })
            }
            store.dispatch(updateEntityData([], [], [], false));
            store.dispatch(updateEntityConnectionsData([]));
            window.scrollTo(0, 0);
        }
        if(prevProps.location.search !== this.props.location.search) {
            let tmp_array = this.props.location.search.slice(1).split("&");
            let filter = "";
            let order_by = "";
            let order_direction = "";
            tmp_array.map((item) => {
                let tmp_array2 = item.split("=");
                if(tmp_array2[0] === "connection_type_category" || tmp_array2[0] === "?connection_type_category") {
                        filter = tmp_array2[1]
                }
                if(tmp_array2[0] === "order_by" || tmp_array2[0] === "?order_by") {
                        order_by = tmp_array2[1]
                }
                if(tmp_array2[0] === "order_direction" || tmp_array2[0] === "?order_direction") {
                        order_direction = tmp_array2[1]
                }
                return item;
            });
            const sameAsState = (filter === this.state.filter) && (order_by === this.state.order_by) && (order_direction === this.state.order_direction);
            if(!sameAsState) {
                if(filter !== this.state.filter) {
                    this.handleFilter(filter, true);
                }
                if(order_by !== this.state.order_by || order_direction !== this.state.order_direction) {
                    this.handleSort(order_by+"_"+order_direction, true)
                }
            }
        }
    }

    componentWillUnmount() {
        store.dispatch(updateEntityData([], [], [], false));
        store.dispatch(updateEntityConnectionsData([]));
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

    handleChange = nextValue => {
        store.dispatch(searchAutocomplete(''));
        this.props.history.push("/search/" + nextValue + "/0/" + number_per_page)
    };

    handleFilter = (e, f) => {
        if(e !== "") {
            //if(f === undefined) {
                this.setState({filter: e});
            //}
            if(this.state.order_by !== "") { //sort & filter
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, e, this.state.order_by, this.state.order_direction));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id + "?connection_type_category=" + e + "&order_by=" + this.state.order_by + "&order_direction=" + this.state.order_direction);
                }
            }
            else {//filter
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, e, "valid_to", "desc"));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id + "?connection_type_category=" + e);
                }
            }
        }
        else {
            //if(f === undefined) {
                this.setState({filter: ""});
            //}
            if(this.state.order_by !== "") {//sort
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, "", this.state.order_by, this.state.order_direction));
                if(f === undefined){
                    this.props.history.push("/entity/" + this.props.match.params.id + "?order_by=" + this.state.order_by + "&order_direction=" + this.state.order_direction);
                }
            }
            else {//none
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, "", "valid_to", "desc"));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id );
                }
            }
        }
    };

    handleSort = (e, f) => {
        if(e !== "" && e !== "none" && e !== "_") {
            this.setState({
                order_by: e.substr(0, e.lastIndexOf("_")),
                order_direction: e.substr(e.lastIndexOf("_")+1)
            });
            if(this.state.filter !== undefined && this.state.filter !== "") { //sort & filter
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, this.state.filter, e.substr(0, e.lastIndexOf("_")), e.substr(e.lastIndexOf("_")+1)));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id + "?connection_type_category=" + this.state.filter + "&order_by=" + e.substr(0, e.lastIndexOf("_")) + "&order_direction=" + e.substr(e.lastIndexOf("_") + 1));
                }
            }
            else {//sort
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, "", e.substr(0, e.lastIndexOf("_")), e.substr(e.lastIndexOf("_")+1)));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id + "?order_by=" + e.substr(0, e.lastIndexOf("_")) + "&order_direction=" + e.substr(e.lastIndexOf("_") + 1));
                }
            }
        }
        else {
            this.setState({
                order_by: "",
                order_direction: ""
            });
            if(this.state.filter !== undefined && this.state.filter !== "") { //filter
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, this.state.filter, "valid_to", "desc"));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id + "?connection_type_category=" + this.state.filter);
                }
            }
            else {//none
                store.dispatch(entityConnections(this.props.match.params.id, 0, number_per_page, "", "valid_to", "desc"));
                if(f === undefined) {
                    this.props.history.push("/entity/" + this.props.match.params.id);
                }
            }
        }
    };

    setFollowEntity = () => {
        let token = loadState("activeUser") !== undefined && loadState("activeUser").activeUser !== undefined && loadState("activeUser").activeUser.token !== undefined ?
            loadState("activeUser").activeUser.token : "";
        if(token !== "") store.dispatch(followEntity(this.props.match.params.id, token))
    };

    render() {
        const { inputValue } = this.props;
        return (
                <div className="Entity-container container">
                    <div className="row Entity-row">
                        <div className="col-lg-8 Entity-left-column">
                            <div className={"Search-Field-header"}>
                                {this.props.windowSize.windowWidth < 1400 ?
                                    <SearchInputHeader value={inputValue} onSubmit={this.handleChange}/>
                                    :
                                    <SearchInput className={"d-none d-lg-block"} value={inputValue}
                                                 onSubmit={this.handleChange}/>}
                                <SearchAutocomplete /*params={this.props.match.path}*//>
                            </div>
                            {this.state.error !== undefined && this.state.site_type !== undefined && this.state.error !== null && this.state.site_type !== null && this.state.site_type === "entity" ?
                                <PageNotFound page={"entity"} id={this.props.match.params}/>
                                :
                                <div>
                                    <EntityData params={this.props.match.params} loggedIn={this.state.loggedIn}
                                                setFollowEntity={this.setFollowEntity}/>
                                    <div className="Entity-left-column-start-visualisation">
                                        <Link to={"/filter/" + this.props.match.params.id}>
                                            <p>{START_FILTER}
                                                <span className="font-awesome-holder">&nbsp;&nbsp;<FontAwesomeIcon icon={"sitemap"}/></span>
                                            </p>
                                        </Link>
                                    </div>
                                    <div className={"empty-row"}></div>
                                    <div className={"empty-row"}></div>
                                    <div>
                                        <EntityConnectionsData params={this.props.match.params}
                                                               location={this.props.location.search}
                                                               handleSortConnectionChange={this.handleSort}
                                                               handleConnectionTypeChange={this.handleFilter}
                                                               filter={this.state.filter}
                                                               order_by={this.state.order_by}
                                                               order_direction={this.state.order_direction}
                                        />
                                        <div className="row empty-row"></div>
                                        <div className="row empty-row"></div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="col-lg-4 Entity-right-column">
                            <AboutShort/>
                            <div className="Entity-right-column-inner-div-no-border">
                                <EntityRelatedEntitiesData id={this.props.match.params.id}/>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default withWindowSizeListener(Entity);