import React, {Component} from 'react'
import "./styles/Filter.css"
import "./styles/ConnectedConnections.css"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'
import {Link} from 'react-router-dom'
import {store} from "./index"
import {
    entity,
    entityEntityConnections,
    deleteEntityData,
    filterConnections,
    filterConnectionTypeCategories,
    filterEntityTypeData,
    updateConnectionTypeCategoriesData, deleteFilterConnections
} from "./actions"
import Graph from 'vis-react'
import FilterEntityCheckboxTree from './components/FilterEntityCheckboxTree'
import FilterEntityRightColumn from './components/FilterEntityRightColumn'
import FilterConnectionsRightColumn from './components/FilterConnectionsRightColumn'
import DayPickerData from "./containers/dayPickerData"
import AddNameModal from "./components/AddNameModal"
import { ga_trackingID, number_per_page_filter, number_per_page_by_db } from "./config"
import ReactPaginate from 'react-paginate'
import {loadState} from "./localStorage"
import * as Lang from "./lang"
import LoadingBar from 'react-redux-loading-bar'
import ReactGA from 'react-ga'
//import { showLoading, hideLoading } from 'react-redux-loading-bar'

export default class Filter extends Component {
    constructor(props) {
        super(props);

        this.vis = null;
        this.state = {
            isChecked: false,
            isVisibleSearch: false,
            isVisibleFilter: true,
            nodesConnection: [],
            nodesEntity: [],
            entityTypeCategoriesChecked: [],
            entityTypesChecked: [],
            entityTypeCategoriesSemiChecked: [],
            connectionTypeCategoriesChecked: [],
            connectionTypesChecked: [],
            connectionTypeCategoriesSemiChecked: [],
            dateFrom: "",
            dateTo: "",
            valueFrom: "",
            valueTo: "",
            getSearch: this.props.location.search,
            connectionSelected: false,
            openedChildren: false,
            closeConnectionChildren: false,
            closeEntityChildren: false,
            showModal: false,
            str: "",
            offset: 0,
            graph: store.getState().rootReducer.reducer.graph,
            page: 0
        };
    }

    changed = false;
    savedSearch = false;
    search = "";
    isNumberFrom = false;
    isNumberTo = false;

    componentWillMount() { //ako mi je došao search u url-u spremam ga i mičem iz url-a
        if(this.props.history !== undefined){
            this.unlisten = this.props.history.listen(() => {
                ga_trackingID !== undefined && ga_trackingID !== "" && ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
        /*this.setState({
            str: this.props.location.search
        });*/
        this.search = this.props.location.search;
        //this.props.history.push("/filter/" + this.props.match.params.id)
    }

    componentDidMount() {
        this.search !== "" && this.setState({
            str: this.search
        });
        document.title = Lang.SITE_NAME + " - " + Lang.VISUALIZATION;
        document.getElementById('App-Footer').classList.add('displayNone');
        document.getElementById('App-Header').classList.add('displayNone');
        if(window.innerWidth < 768) {
            this.setState({
                isVisibleFilter: false
            })
        }
        store.dispatch(deleteEntityData());
        let str = "";
        if (this.props.location.search !== "") {
            str = this.props.location.search;
            this.setState({
                str: str
            })
        }
//prvo iz url-a popunjavam stringove u state za od-do i pep
        if (str !== "") {
            if (str.substr(0, 1) === "?") {
                str = str.substr(1);
            }
            let tmp_array = str.split("&");
            let entity_type_array = [];
            let connection_type_array = [];
            let pep_array = [];
            let from_array = [];
            let to_array = [];
            let amount_from_array = [];
            let amount_to_array = [];
            tmp_array.map((item, index) => {
                if(item.split("=")[0] === "entity_type") {
                    entity_type_array.push(item.split("=")[1]);
                }
                else if(item.split("=")[0] === "connection_type") {
                    connection_type_array.push(item.split("=")[1]);
                }
                else if (item.split("=")[0] === "is_pep") {
                    pep_array.push(item.split("=")[1]);
                }
                else if(item.split("=")[0] === "valid_from") {
                    from_array.push(item.split("=")[1]);
                }
                else if(item.split("=")[0] === "valid_to") {
                    to_array.push(item.split("=")[1]);
                }
                else if(item.split("=")[0] === "transaction_amount_from") {
                    amount_from_array.push(item.split("=")[1]);
                }
                else if(item.split("=")[0] === "transaction_amount_to") {
                    amount_to_array.push(item.split("=")[1]);
                }
                return "";
            });
            if(entity_type_array.length > 0) {
                this.setState({entityTypesChecked: entity_type_array});
            }
            else {
                this.setState({entityTypesChecked: []});
            }
            if(connection_type_array.length > 0) {
                this.setState({connectionTypesChecked: connection_type_array});
            }
            else {
                this.setState({connectionTypesChecked: []});
            }
            if(pep_array.length === 1) {
                this.setState({isChecked: true});
            }
            else {
                this.setState({isChecked: false});
            }
            if(from_array.length === 1) {
                let from = from_array[0].replace(/%20/g, " ");
                this.setState({dateFrom: from});
            }
            else {
                this.setState({dateFrom: ""});
            }
            if(to_array.length === 1) {
                let to = to_array[0].replace(/%20/g, " ");
                this.setState({dateTo: to});
            }
            else {
                this.setState({dateTo: ""});
            }
            if(amount_from_array.length === 1) {
                this.setState({valueFrom: parseFloat(amount_from_array[0])});
            }
            else {
                this.setState({valueFrom: ""});
            }
            if(amount_to_array.length === 1) {
                this.setState({valueTo: parseFloat(amount_to_array[0])});
            }
            else {
                this.setState({valueTo: ""});
            }
        }
//end string for checkboxes
        //ide fetch:
        store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + str));//popunjava graf
        store.dispatch(filterConnectionTypeCategories(this.props.match.params.id, this.props.location.search));//connections checkboxes skupa sa setConnectionTypeCategoriesData
        store.dispatch(filterEntityTypeData());//entityTypesData se napuni

        this.unsubscribe = store.subscribe(() => { //icons for checkboxes
            const tmp_nodes_connection = store.getState().rootReducer.reducer.connectionsTypeCategoryData;
            const icon = <FontAwesomeIcon icon="check"/>;
            tmp_nodes_connection.map((item, index) => {
                item.icon = icon;
                if (item.children !== undefined && item.children.length > 0) {
                    item.children.map((item, index) => {
                        item.icon = icon;
                        return item;
                    })
                }
                return item;
            });
            //if(this.state.nodesConnection === [] && i === 0) {
                //i += 1;
            //if(tmp_nodes_connection !== [] && this.state.nodesConnection !== tmp_nodes_connection) {
                this.setState({
                    nodesConnection: tmp_nodes_connection,
                });
            //}
            //}
            const tmp_nodes_entity = store.getState().rootReducer.reducer.entityTypesData;
            tmp_nodes_entity.map((item, index) => {
                item.icon = icon;
                if (item.children !== undefined && item.children.length > 0) {
                    item.children.map((item, index) => {
                        item.icon = icon;
                        return item;
                    })
                }
                return item;
            });
            //if(this.state.nodesEntity === [] && j === 0) {
                //j += 1;
            //if(tmp_nodes_entity !== [] && this.state.nodesEntity !== tmp_nodes_entity) {
                this.setState({
                    nodesEntity: tmp_nodes_entity
                });
                this.setState({
                    graph: store.getState().rootReducer.reducer.graph
                });
            //}
            //}
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.str !== this.state.str) {
            this.setState({
                offset: 0,
                page: 0
            })
        }
        if(prevState.graph !== this.state.graph) {
            this.changed = true;
            this.setState({
                //offset: 0
            })
        }
        if(prevProps.location.pathname !== this.props.location.pathname || prevProps.location.search !== this.props.location.search) {
            store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + this.state.str));//popunjava graf
            store.dispatch(filterConnectionTypeCategories(this.props.match.params.id, this.state.str));
        }
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        let offset = Math.ceil(selected * number_per_page_filter);
        this.setState({
            offset: offset,
            page: selected
        });
        let str = "";
        if (this.state.str !== "") str = this.state.str;
        if (str !== "") {
            if (str.substr(0, 1) === "?") {
                str = str.substr(1);
            }
        }
        store.dispatch(filterConnections(this.props.match.params.id, offset, number_per_page_filter, "&" + str));//!!!!!
    };

    toggleCheck(e) {
        this.setState({isChecked: e.target.checked});
        let tmp = this.state.str;

        if(tmp.charAt(0) === "?") {
            tmp = tmp.substring(1);
        }
        if(e.target.checked) {
            if(tmp !== "") {
                tmp += "&is_pep=true";
            }
            else {
                tmp = "is_pep=true";
            }
        }
        else {
            if(tmp.charAt(0) === "?") {
                tmp = tmp.substring(1);
            }
            let pocetak = tmp.indexOf("is_pep=true");
            if((pocetak === 0 && tmp.charAt(pocetak+11) === "&")
                || (tmp.charAt(pocetak-1) ==="&" && tmp.charAt(pocetak+11) === "&")){
                tmp = tmp.substring(0, pocetak)+tmp.substring(pocetak+11);
            }
            else if(pocetak === 0 && tmp.charAt(pocetak+11) === ""){
                tmp = "";
            }
            else if(tmp.charAt(pocetak-1) ==="&" && tmp.charAt(pocetak+11) === ""){
                tmp = tmp.substring(0, pocetak);
            }
        }
        if(tmp.charAt(tmp.length-1) === "&") {

            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            getSearch: "?" + tmp
        });
        //this.props.history.push("/filter/" + this.props.match.params.id + "?" + tmp);
        this.setState({
            str: tmp
        });
        store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + tmp));//popunjava graf
    }

    setStringFromConnectionCheckboxes = (parents, children, ajax, semiChecked) => {
        let tmp = "";
        this.setState({
            connectionTypeCategoriesChecked: parents,
            connectionTypesChecked: children,
            connectionTypeCategoriesSemiChecked: semiChecked
        });
        store.dispatch(updateConnectionTypeCategoriesData(this.props.match.params.id, tmp));
        let tmp_array_from_str = this.state.str.split("&");
        tmp_array_from_str.map((item) => {
            let tmp_array = item.split("=");
            if(tmp_array[0] !== "connection_type_category" && tmp_array[0] !== "connection_type") {
                if (item !== "") tmp += item + "&";
            }
            return item;
        });
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        let ajax_array = Object.keys(ajax).map(function(key) {
            return ajax[key];
        });
        if(ajax_array.length > 0){
            ajax_array.map((item) => {
                if(item.parent === item.child) {
                    return tmp += "&connection_type_category="+item.parent;
                }
                else {
                    return tmp += "&connection_type="+item.child;
                }
            });
            tmp.substring(1);
        }
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            str: tmp,
            getSearch: "?" + tmp
        });
        store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + tmp));//popunjava graf
    };

    setStringFromEntityCheckboxes = (parents, children, ajax, semiChecked) => {
        let tmp = "";
        this.setState({
            entityTypeCategoriesChecked: parents,
            entityTypesChecked: children,
            entityTypeCategoriesSemiChecked: semiChecked
        });
        let tmp_array_from_str = this.state.str.split("&");
        tmp_array_from_str.map((item) => {
            let tmp_array = item.split("=");
            if(tmp_array[0] !== "entity_type" && tmp_array[0] !== "legal_entity_type") {
                if (item !== "") tmp += item + "&";
            }
            return item;
        });
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        let ajax_array = Object.keys(ajax).map(function(key) {
            return ajax[key];
        });
        if(ajax_array.length > 0){
            ajax_array.map((item) => {
                //if(parents.includes(item)) return tmp += "&entity_type="+item;
                //else return tmp += "&legal_entity_type="+item;
                if(item.parent === item.child) {
                    return tmp += "&entity_type="+item.parent;
                }
                else {
                    return tmp += "&legal_entity_type="+item.child;
                }
            });
            if(tmp.substr(0, 1) === "&") tmp.substring(1);
        }
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            str: tmp
        });
        store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + tmp));//popunjava graf
    };

    setOpenedChildren = (group) => {
        if(this.state.openedChildren !== false && this.state.openedChildren !== group) {
            if(this.state.openedChildren === "connection_type") {
                this.setState({
                    closeConnectionChildren: true
                });
            }
            if(this.state.openedChildren === "entity_type") {
                this.setState({
                    closeEntityChildren: true
                });
            }
        }
        if(this.state.openedChildren !== group) {
            this.setState({
                openedChildren: group
            })
        }
    };

    setCloseConnectionChildren = (group) => {
        if(this.state.closeConnectionChildren) {
            this.setState({
                closeConnectionChildren: false
            });
        }
    };

    setCloseEntityChildren = (group) => {
        if(this.state.closeEntityChildren) {
            this.setState({
                closeEntityChildren: false
            });
        }
    };

    setVisibleSearch = (e) => {
        this.setState({
            isVisibleSearch: e
        })
    };

    setStringFromDateFromTo = (e, f) => {
        let tmp = "";
        let tmp_array_from_str = this.state.str.split("&");
        tmp_array_from_str.map((item) => {
            let tmp_array = item.split("=");
            if(tmp_array[0] !== "valid_from" && tmp_array[0] !== "valid_to") {
                tmp += item + "&";
            }
            return item;
        });
        if(tmp.substr(tmp.length-1, tmp.length) === "&"){
            tmp = tmp.substr(0, tmp.length-1);
        }
        if(e !== undefined && e !== null && e !== "") {
            let tmp_date =  new Date(e);
            let tmp_day = tmp_date.getDate();
            if(tmp_day < 10) {
                tmp_day = "0" + tmp_day;
            }
            let tmp_month = tmp_date.getMonth()+1;
            if(tmp_month < 10) {
                tmp_month = "0" + tmp_month;
            }
            let tmp_year = tmp_date.getFullYear();
            const e_tmp =  tmp_year + "-" + tmp_month + "-" + tmp_day;
            this.setState({
                dateFrom: e_tmp
            });
            if(e !== null) {
                if(tmp !== "" ) {
                    tmp += "&"
                }
                tmp += "valid_from="+e_tmp;
            }
            if(this.state.dateTo) {
                if(tmp !== "") {
                    tmp += "&"
                }
                tmp += "valid_to="+this.state.dateTo;
            }
        }
        else if(e !== null) {
            this.setState({
                dateFrom: ""
            });
            if(this.state.dateTo) {
                if(tmp !== "") {
                    tmp += "&"
                }
                tmp += "valid_to="+this.state.dateTo;
            }
        }
        if(f !== undefined && f !== null && f !== "") {
            let tmp_date =  new Date(f);
            let tmp_day = tmp_date.getDate();
            if(tmp_day < 10) {
                tmp_day = "0" + tmp_day;
            }
            let tmp_month = tmp_date.getMonth()+1;
            if(tmp_month < 10) {
                tmp_month = "0" + tmp_month;
            }
            let tmp_year = tmp_date.getFullYear();
            const f_tmp =   tmp_year + "-" + tmp_month + "-" + tmp_day;
            this.setState({
                dateTo: f_tmp
            });
            if(this.state.dateFrom) {
                if(tmp !== "") {
                    tmp += "&"
                }
                tmp += "valid_from="+this.state.dateFrom;
            }
            if(f !== null) {
                if(tmp !== "") {
                    tmp += "&"
                }
                tmp += "valid_to="+f_tmp
            }
        }
        else if(f !== null) {
            this.setState({
                dateTo: ""
            });
            if(this.state.dateFrom) {
                if(tmp !== "") {
                    tmp += "&"
                }
                tmp += "valid_from="+this.state.dateFrom;
            }
        }
        if(tmp.charAt(tmp.length-1) === "&") {
            tmp = tmp.substring(0, tmp.length-1);
        }
        //this.props.history.push("/filter/?" + tmp);
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            getSearch: "?" + tmp,
            str: tmp
        });
        if(!(e === undefined && f === null) && !(e === null && f === undefined)) {//popunjava graf:
            store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + tmp));
        }
    };

    updateValueFrom(e) {
        let tmp = "";
        let from = e.target.value;
        if(from !== "") {
            this.setState({
                valueFrom: from//Math.round(parseFloat(from) * 100) / 100
            });
            from = from.replace(",", ".");
            if (!isNaN(from)) {
                this.isNumberFrom = true;
            }
            else {
                this.isNumberFrom = false;
            }
        }
        else {
            this.setState({
                valueFrom: ""
            })
        }
        let tmp_array_from_str = this.state.str.split("&");
        tmp_array_from_str.map((item) => {
            let tmp_array = item.split("=");
            if(tmp_array[0] !== "transaction_amount_from") {
                tmp += item + "&";
            }
            return item;
        });
        if(!isNaN(from) && from !== "") {
            if(tmp !== "" && tmp.substring(tmp.length-1,tmp.length) !== "&") {
                tmp += "&"
            }
            tmp += "transaction_amount_from="+Math.round(parseFloat(from)*100)/100;
        }
        /*if(this.state.valueTo !== null && this.state.valueTo !== "") {
            if(tmp !== "" && tmp.substring(tmp.length-1,tmp.length) !== "&") {
                tmp += "&"
            }
            tmp += "transaction_amount_to="+this.state.valueTo;
        }*/
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            getSearch: "?" + tmp,
            str: tmp
        });
        if(this.isNumberFrom) {
            //this.props.history.push("/filter/" + this.props.match.params.id + "?" + tmp);
            store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + tmp));//popunjava graf
        }
    }

    updateValueTo(e) {
        let tmp = "";
        let to = e.target.value;
        if(to !== "") {
            this.setState({
                valueTo: to//Math.round(parseFloat(to)*100)/100
            })
            to = to.replace(",", ".");
            if(!isNaN(to)) {
                this.isNumberTo = true;
            }
            else {
                this.isNumberTo = false;
            }
        }
        else {
            this.setState({
                valueTo: ""
            })
        }
        let tmp_array_from_str = this.state.str.split("&");
        tmp_array_from_str.map((item) => {
            let tmp_array = item.split("=");
            if(tmp_array[0] !== "transaction_amount_to") {
                tmp += item + "&";
            }
            return item;
        });
        if(!isNaN(to) && to !== "") {
            if(tmp !== "" && tmp.substring(tmp.length-1,tmp.length) !== "&") {
                tmp += "&"
            }
            tmp += "transaction_amount_to="+Math.round(parseFloat(to)*100)/100;
        }
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            getSearch: "?" + tmp,
            str: tmp
        });
        if(this.isNumberTo) {
            store.dispatch(filterConnections(this.props.match.params.id, 0, number_per_page_filter, "&" + tmp));//popunjava graf
        }
    }

    hideSearchComponent() {
        this.setState({
            isVisibleSearch: false,
        });
    }

    toggleFilterBody() {
        if (this.state.isVisibleFilter && this.state.isVisibleSearch) {
            this.setState({
                isVisibleSearch: false,
            })
        }
        this.setState({
            isVisibleFilter: !this.state.isVisibleFilter,
        });
    }

    setModalShow = (e) => {
        this.setState({
            showModal: e
        })
    };

    openModal(link) {
        this.setState({
            showModal: true,
            link: link
        })
    };

    saveLink(link) {
        this.openModal(link);
        //console.log("spremi search", link.pathname+link.search);
        //store.dispatch(setSavedLink("vizualizacija3", link.pathname+link.search, loadState("activeUser").activeUser.token))
    }

    componentWillUnmount() {document.getElementById('App-Footer').classList.remove('displayNone');
        document.getElementById('App-Header').classList.remove('displayNone');
        store.dispatch(deleteFilterConnections());
        try {
            this.unsubscribe();
        }catch (e) {
            console.log(e)
        }try {
            this.unlisten();
        } catch (e) {
            console.log(e)
        }
    }

    getNetwork(data) {
        this.setState({ network: data });
    }

    /*setOptions = () => {
        console.log("set options");
        let tmp = this.state.options;
        tmp.physics = {enabled: false}
        this.setState({
            options : tmp
        })
    };*/
    /*
    createImage(type) {
        const icon = <FontAwesomeIcon icon="male" />;
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewPort="0 0 120 120">' +
            '<ellipse ry="50" rx="50" cy="60" cx="60" style="fill:#e8e7de;fill-opacity:1;stroke:#e8e7de;stroke-width:2;stroke-opacity:1" />' +
            '<text x="30" y="80" style="font-size:60px;fill:#000000;">&#9893;</text>' +
            '</svg>';

        return "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent(svg);
    }*/

    render() {
        const search = this.state.getSearch;
        let total = store.getState().rootReducer.reducer.graphTotal !== undefined ? store.getState().rootReducer.reducer.graphTotal : 1;
        total -= 1;
        if(store.getState().rootReducer.reducer.graphTotal > 100000) {
            total = 99999;
        }
        const graph = store.getState().rootReducer.reducer.graph;
        let options = {
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -50000,
                    avoidOverlap: 1
                },
                //stabilization: { iterations: 2500 }
            },
            autoResize: true,
            interaction: {
                selectConnectedEdges: false,
                //dragView: false
            },
            nodes: {
                chosen: true,
                shape: 'image',//'icon',   'circularImage',
                icon: {
                    face: 'FontAwesome',
                    size: 24
                }
                //image: this.createImage('person')
            },
            edges: {
                arrows: {
                    to: {
                        enabled: false
                    }
                },
                width: 2,
                chosen: true,
                color: {
                    //inherit: true
                    color: "rgba(0,0,0,0.4)",
                    highlight: "rgba(0,0,0,0.4)",
                    hover: "#e0303e"
                },
                font: {
                    size: 18,
                    vadjust: -8,
                    strokeWidth: 1,
                    strokeColor: "rgba(0, 0, 0, 0.6)",
                    multi: 'html'
                    //background: "#f6da00"
                }
            }
        };
        //let doubleClickTime = 0;
        const pushHistory = (node, str) => {
            this.setState({
                getSearch: "?" + str
            });
            return this.props.history.push("/filter/" + node/* + "?" + str*/);//todo
        };
        const doOnClick = (event) => {
            if(event.nodes[0]) {
                store.dispatch(entity(event.nodes[0], "", "filter"));
                //store.dispatch(hideLoading());
            }
        };
        const onClick = (event) => {
            //store.dispatch(showLoading());
            //let t0 = new Date();
            //if (t0 - doubleClickTime > 400) {
                //setTimeout(function () {
                    //if (t0 - doubleClickTime > 400) {
                        doOnClick(event);
                    //}
                //},500);
            //}
        };
        const onDoubleClick = (event) => {
            //doubleClickTime = new Date();
            let str = "";
            if (search !== "") str = search;
            if (str !== "") {
                if (str.substr(0, 1) === "?") {
                    str = str.substr(1);
                }
            }
            if(event.nodes[0]) {
                //store.dispatch(filterConnections(event.nodes[0], 0, number_per_page_filter, "&" + str));//popunjava graf
                //store.dispatch(filterConnectionTypeCategories(event.nodes[0], search));
                pushHistory(event.nodes[0], str);
            }
        };
        const selectedEdge = (e) => {
            this.setState({
                connectionSelected: e
            })
        };
        let vis = this.vis;
        let events = {
            selectNode: function (event) {onClick(event)/*doOnClick(event);*/},
            selectEdge: function (event) {
                if (event.nodes[0] === undefined || event.nodes[0] === "") {
                    const entity_a = event.edges[0].split("__")[0];
                    const entity_b = event.edges[0].split("__")[1];
                    store.dispatch(entityEntityConnections(entity_a, entity_b, search, 0, number_per_page_by_db));
                    selectedEdge(true);
                }
            },
            deselectEdge: function() {
                selectedEdge(false);
            },
            doubleClick: function (event) {onDoubleClick(event)},
            stabilized: function (event) {
                if(event.iterations > 1) {
                    vis.Network.physics.physicsEnabled = false;
                }
            }
        };
        if(this.changed) {
            vis.Network.physics.physicsEnabled = true;
        }
        if(graph.nodes.length === 2) {
            vis.Network.physics.stabilizationIterations = 100;
        }
        return (
            <div className={"container-fluid"}>
                <div className={"visualization"}>
                    <Graph
                        graph={store.getState().rootReducer.reducer.graph}
                        options={options}
                        getNetwork={this.getNetwork.bind(this)}
                        events={events}
                        ref={vis => (this.vis = vis)}
                    />
                    <div className={"Filter-closeButton"}>
                        <Link to={'/entity/' + this.props.match.params.id}>
                            {Lang.CLOSE} <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"times"}/></span>
                        </Link>
                    </div>
                </div>
                <div className={this.state.isVisibleFilter ? "Filter Filter-Body-shown" : "Filter Filter-Body-hidden"} /*style={{bottom: this.state.isVisibleFilter ? "0" : "unset"}}*/>
                    <div className={"Filter-Header"}>
                        <span className={"Filter-Header-title"}>{Lang.FILTER} </span>
                        <button style={{background: "transparent", border: "none"}}
                                onClick={() => this.toggleFilterBody()}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon
                                icon={this.state.isVisibleFilter ? "minus" : "plus"}/></span>
                        </button>
                    </div>
                    <LoadingBar className={"LoadingBar"} showFastActions />
                    <div className={"Filter-Body"} style={{display: this.state.isVisibleFilter ? "block" : "none"}}>
                        <div className={"Filter-Tabs"} style={{display: "none"}}>
                            <div className={"Filter-Tab activeTab"}>
                                <span className={"font-awesome-holder"}>
                                    <FontAwesomeIcon icon={"user"}/>
                                </span> {Lang.ENTITY}
                            </div>
                            <div className={"Filter-Tab"}>
                                <span className={"font-awesome-holder"}>
                                    <FontAwesomeIcon icon={"arrows-alt-h"}/>
                                </span> {Lang.CONNECTION}
                            </div>
                        </div>
                        <div>
                            {/*
                            <div className={"Filter-Search"} style={{display: "none"}}>
                                <input type={"search"} placeholder={"Upiši naziv ili ime"}/>
                                <button className="search-button"><FontAwesomeIcon icon="search"/></button>
                            </div>
                            <div className={"Filter-Search-AllShown"} style={{display: "none"}}>
                                <div className={"Filter-Search-Shown"}>
                                    Tomislav Karamarko <button><FontAwesomeIcon icon={"times"}/></button></div>
                                </div>
                            </div>
                                */}
                            <div className={"star-div"}
                                 title={Lang.SAVE_CONNECTIONS_FILTER_TITLE}
                                 style={{display: loadState("activeUser") !== undefined && loadState("activeUser").activeUser.token !== undefined && loadState("activeUser").activeUser.token !== null && loadState("activeUser").activeUser.token !== ""
                                         ? "block" : "none"}}>
                                <Button onClick={() => this.saveLink(this.props.location.pathname + (this.state.str !== "" ? "/?" : "") + this.state.str)}><span className={"grey-icon"}><FontAwesomeIcon icon={"star"}/></span><span>{Lang.SAVE_CONNECTIONS_FILTER}</span></Button>
                            </div>
                            <div className={"Filter-Connection-category"}>
                                <div className={"Filter-Connection-category-header"}> {Lang.FILTER_CONNECTIONS_CATEGORIES}</div>
                                <FilterEntityCheckboxTree params={this.state.nodesConnection}
                                                          location={this.props.location}
                                                          id={this.props.match.params.id}
                                                          checkboxesGroupName={"connection_type"}
                                                          setParentState={this.setStringFromConnectionCheckboxes}
                                                          setOpenedChildren={this.setOpenedChildren}
                                                          openedChildren={this.state.openedChildren}
                                                          closeChildrenConn={this.state.closeConnectionChildren}
                                                          setCloseChildren={this.setCloseConnectionChildren}
                                                          isVisibleSearch={this.state.isVisibleSearch}
                                                          setVisibleSearch={this.setVisibleSearch}
                                                          semiChecked={this.state.semiCheckedConn}
                                />
                            </div>
                            <div className={"Filter-Connection-category"} style={{/*display: "none"*/}}>
                                <div className={"Filter-Connection-category-header"}> {Lang.DATES}</div>
                                <DayPickerData from={this.state.dateFrom} to={this.state.dateTo} setParentState={this.setStringFromDateFromTo}/>
                            </div>
                            <div className={"Filter-Connection-category"} style={{/*display: "none"*/}}>
                                <div className={"Filter-Connection-category-header"}> {Lang.TRANSACTIONS_AMOUNTS}</div>
                                <div className={"transactionAmount"}>
                                    <form>
                                        <input type="text"
                                               onChange={e => {e.preventDefault(); this.updateValueFrom(e)}}
                                               value={this.state.valueFrom}
                                               name="valueFrom" id="Filter-Value-From"
                                               placeholder={Lang.FROM}
                                               className={(this.isNumberFrom || this.state.valueFrom === "") ? "" : "wrongInput"}
                                        />
                                        <input type="text"
                                               onChange={e => {e.preventDefault(); this.updateValueTo(e);}}
                                               value={this.state.valueTo}
                                               name="valueTo"
                                               id="Filter-Value-To"
                                               placeholder={Lang.TO}
                                               className={(this.isNumberTo || this.state.valueTo === "") ? "" : "wrongInput"}
                                        />
                                    </form>
                                </div>
                            </div>
                            <div className={"Filter-Connection-category"}>
                                <div className={"Filter-Connection-category-header"}> {Lang.FILTER_CONNECTIONS_ENTITIES}</div>
                                <FilterEntityCheckboxTree params={this.state.nodesEntity}
                                                          location={this.props.location}
                                                          id={this.props.match.params.id}
                                                          checkboxesGroupName={"entity_type"}
                                                          setParentState={this.setStringFromEntityCheckboxes}
                                                          setOpenedChildren={this.setOpenedChildren}
                                                          openedChildren={this.state.openedChildren}
                                                          closeChildrenEn={this.state.closeEntityChildren}
                                                          setCloseChildren={this.setCloseEntityChildren}
                                                          isVisibleSearch={this.state.isVisibleSearch}
                                                          setVisibleSearch={this.setVisibleSearch}
                                                          semiChecked={this.state.semiCheckedEnt}
                                                          />
                            </div>
                            <div className={"Filter-Connection-category"} style={{/*display: "none"*/}}>
                                <div className={"Filter-Connection-category-header"}> {Lang.VISUALIZATION}</div>
                                <div className={"FormGroup-PEP"}>
                                            <input type="checkbox"
                                                   onChange={e => this.toggleCheck(e)}
                                                   checked={this.state.isChecked}
                                                   name="Filter-Connection-checkbox"
                                                   id="Filter-Connection-checkbox" />
                                        <label htmlFor="Filter-Connection-checkbox">
                                            <span><FontAwesomeIcon icon={"check"}/></span>
                                            {Lang.SHOW_ONLY_PEP}
                                        </label>
                                </div>
                                <div className={"Filter-Connection-category-description"}>
                                    {Lang.PEP_EXPLANATION}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"Filter-Category-Search"}
                     style={{display: this.state.isVisibleSearch ? "block" : "none"}}>
                    <div className={"Filter-Category-Search-Header"}>
                        <span className={"Filter-Category-Search-Header-title"}>{Lang.SEARCH} </span>
                        <div className={"Filter-Category-Search-Header-close"}>
                            <button style={{background: "transparent", border: "none"}}
                                    onClick={() => this.hideSearchComponent()}>
                                {Lang.CLOSE} <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"times"}/></span>
                            </button>
                        </div>
                    </div>
                    <div className={"Filter-Category-Search-Search"}>
                        <input className="search-input" ref="search" type="search"
                               placeholder={Lang.SEARCH_PLACEHOLDER_VISUALIZATION}/>
                        <button className="search-button"><FontAwesomeIcon icon="search"/></button>
                    </div>
                    <div className={"Filter-Category-Search-Results"}>

                    </div>
                </div>
                <FilterEntityRightColumn/>
                <FilterConnectionsRightColumn selected = {this.state.connectionSelected} params = {this.props.location.search} diselect={selectedEdge}/>

                <div className={"FilterVisualisation-Pagination"} style={{display: Math.ceil(total / number_per_page_filter) < 2 ? 'none' : null}} key={this.state.getSearch}>
                    <ReactPaginate
                        previousLabel={Lang.PAGINATION_PREVIOUS}
                        nextLabel={Lang.PAGINATION_NEXT}
                        //breakLabel={<a href="">...</a>}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(total / number_per_page_filter)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination_container"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        forcePage={this.state.page}
                    />
                    <div className={"Paginatation-more-div"}>{(store.getState().rootReducer.reducer.graphTotal !== undefined && store.getState().rootReducer.reducer.graphTotal > 100000)
                        ? Lang.MORE + ". " + Lang.TOTAL + " " + store.getState().rootReducer.reducer.graphTotal + " " + Lang.DATA_PLURAL
                        : ""}
                    </div>
                </div>
                {total > 0 && <div className={"FilterVisualisation-Pagination-right"}><b>{this.state.offset+1} - {this.state.offset+number_per_page_filter > total ? (this.state.offset+total%number_per_page_filter) :this.state.offset+number_per_page_filter}</b> {Lang.VISUALIZATION_FROM} <b>{total}</b> {Lang.VISUALIZATION_ENTITIES}</div>}
                {this.state.showModal ? <AddNameModal setModal={this.setModalShow} params={this.state.link}/> : null}
            </div>
        )
    }
}