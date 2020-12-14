import React, {Component} from 'react'
import "./styles/Filter.css"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'
import { Button } from 'reactstrap'
import {store} from "./index"
import {
    deleteEntityData,
    filterConnections,
    filterConnectionTypeCategories,
    filterEntityTypeData,
    updateConnectionTypeCategoriesData,
    statistics,
    deleteFilterConnections
} from "./actions"
import FilterEntityCheckboxTree from './components/FilterEntityCheckboxTree'
import FilterEntityRightColumn from './components/FilterEntityRightColumn'
import FilterConnectionsRightColumn from './components/FilterConnectionsRightColumn'
import DayPickerData from "./containers/dayPickerData"
import AddNameModal from "./components/AddNameModal"
import {ga_trackingID, number_per_page} from "./config"
import ReactPaginate from 'react-paginate'
import {loadState} from "./localStorage"
import * as Lang from "./lang"
import LoadingBar from 'react-redux-loading-bar'
import ReactGA from 'react-ga'

export default class FilterConnections extends Component {
    constructor(props) {
        super(props);

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
            windowWidth: window.innerWidth,
            page: 0
        };
    }
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
        //this.props.history.push("/filter/")
    }

    componentDidMount() {
        this.search !== "" && this.setState( {
            str: this.search
        });
        document.title = Lang.SITE_NAME + " - " + Lang.CONNECTIONS;
        document.getElementById('App-Footer').classList.add('displayNone');
        document.getElementById('App-Header').classList.add('displayNone');
        if(window.innerWidth < 768) {
            this.setState({
                isVisibleFilter: false
            })
        }
        store.dispatch(deleteEntityData());
        store.dispatch(statistics());
        let str = "";
        if (this.props.location.search !== ""){
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
        str !== "" && store.dispatch(filterConnections("", 0, number_per_page, "&" + str));//popunjava veze
        store.dispatch(filterConnectionTypeCategories("", this.props.location.search));//connections checkboxes skupa sa setConnectionTypeCategoriesData
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
            this.setState({
                nodesConnection: tmp_nodes_connection,
            });
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
            this.setState({
                nodesEntity: tmp_nodes_entity
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.str !== this.state.str) {
            this.setState({
                page: 0
            })
        }
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        let offset = Math.ceil(selected * number_per_page);
        this.setState({
            //offset: offset,
            page: selected
        });
        let str = "";
        if (this.state.str !== "") str = this.state.str;
        if (str !== "") {
            if (str.substr(0, 1) === "?") {
                str = str.substr(1);
            }
        }
        document.getElementById("visualization-Connections").scrollTop = 0;
        store.dispatch(filterConnections("", offset, number_per_page, "&" + str));//!!!!!
    };

    toggleCheck(e) {
        this.setState({isChecked: e.target.checked});
        //let tmp = this.props.location.search;
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
        if(tmp.startsWith("&")) {
            tmp = tmp.substring(1);
        }
        if(tmp.endsWith("&")) {
            tmp = tmp.substring(0, tmp.length-1);
        }
        this.setState({
            str: tmp
        });
        //this.props.history.push("/filter/?" + tmp);
        if(tmp !== "") store.dispatch(filterConnections("", 0, number_per_page, "&" + tmp));//popunjava veze
        else store.dispatch(deleteFilterConnections())
    }

    setStringFromConnectionCheckboxes = (parents, children, ajax, semiChecked) => {
        let tmp = "";
        this.setState({
            connectionTypeCategoriesChecked: parents,
            connectionTypesChecked: children,
            connectionTypeCategoriesSemiChecked: semiChecked
        });
        store.dispatch(updateConnectionTypeCategoriesData("", tmp));
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
            str: tmp
        });
        if(tmp !== "") store.dispatch(filterConnections("", 0, number_per_page, "&" + tmp));//popunjava veze
        else store.dispatch(deleteFilterConnections());
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
        if(tmp !== "") store.dispatch(filterConnections("", 0, number_per_page, "&" + tmp));//popunjava veze
        else store.dispatch(deleteFilterConnections());
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
            str: tmp
        });

        if(!(e === undefined && f === null) && !(e === null && f === undefined)) {//popunjava graf:
            if(tmp !== "") store.dispatch(filterConnections("", 0, number_per_page, "&" + tmp));//popunjava veze
            else store.dispatch(deleteFilterConnections())
        }
    };

    updateValueFrom(e) {
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
        let tmp = "";
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
        if(this.state.valueTo !== null && this.state.valueTo !== "") {
            if(tmp !== "" && tmp.substring(tmp.length-1,tmp.length) !== "&") {
                tmp += "&"
            }
            tmp += "transaction_amount_to="+this.state.valueTo;
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
        if(this.isNumberFrom) {
            if(tmp !== "") store.dispatch(filterConnections("", 0, number_per_page, "&" + tmp));//popunjava veze
            else store.dispatch(deleteFilterConnections())
        }
    }

    updateValueTo(e) {
        let to = e.target.value;
        if(to !== "") {
            this.setState({
                valueTo: to//Math.round(parseFloat(to)*100)/100
            });
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
        let tmp = "";
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
            str: tmp
        });
        if(this.isNumberTo) {
            if (tmp !== "") store.dispatch(filterConnections("", 0, number_per_page, "&" + tmp));//popunjava veze
            else store.dispatch(deleteFilterConnections())
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

    componentWillUnmount() {
        document.getElementById('App-Footer').classList.remove('displayNone');
        document.getElementById('App-Header').classList.remove('displayNone');
        store.dispatch(deleteFilterConnections());
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

    formatDate = (date) => {
        if (date !== undefined && date !== null) { /* todo: je li datum */
            const tmp_date = date !== null && new Date(date);
            const tmp_day = tmp_date.getDate();
            const tmp_month = tmp_date.getMonth() + 1;
            const tmp_year = tmp_date.getFullYear();
            return tmp_day + ". " + tmp_month + ". " + tmp_year + ".";
        }
        else {
            return "";
        }
    };

    calculateWidthTimeline(oldestDateDB, latestDateDB, validFrom, validTo) { //colored part
        if(validFrom === undefined) validFrom = null;
        if(validTo === undefined) validTo = null;
        if (validFrom !== null || validTo !== null) {
            const today = new Date();
            if(latestDateDB < today) {
                latestDateDB = today;
            }
            if(validFrom !== null) {
                validFrom = new Date(validFrom);
                if(validTo === null) {
                    validTo = latestDateDB;
                }
            }
            if(validTo !== null) {
                validTo = new Date(validTo);
                if(validFrom === null) {
                    validFrom = oldestDateDB
                }
            }
            let diff1 = Math.floor((latestDateDB - oldestDateDB) / (1000 * 60 * 60 * 24));
            let diff2 = Math.floor((validTo - validFrom) / (1000 * 60 * 60 * 24));
            return (100 * diff2 / diff1);
        }
        else return null;

    }

    calculateLeftPositionTimeline(oldestDateDB, latestDateDB, validFrom) { //colored part position
        if(validFrom === undefined) validFrom = null;
        if (validFrom !== null) {
            const today = new Date();
            if(latestDateDB < today) {
                latestDateDB = today;
            }
            validFrom = new Date(validFrom);
            let diff1 = Math.floor((latestDateDB - oldestDateDB) / (1000 * 60 * 60 * 24));
            let diff2 = Math.floor((validFrom - oldestDateDB) / (1000 * 60 * 60 * 24));
            return /*Math.floor(this.fullTimelineWidth()*/100 * diff2 / diff1/*)*/;
        }
        else return 0;
    }

    render() {
        let oldestDateInDB = "";
        let latestDateInDB = new Date();
        if(store.getState().rootReducer.reducer.filterConnections.min_valid !== undefined && store.getState().rootReducer.reducer.filterConnections.min_valid !== null) {
            oldestDateInDB = new Date(store.getState().rootReducer.reducer.filterConnections.min_valid);
            oldestDateInDB = new Date(oldestDateInDB.setDate(oldestDateInDB.getDate() - 30));
        }
        if(store.getState().rootReducer.reducer.filterConnections.max_valid !== undefined && store.getState().rootReducer.reducer.filterConnections.max_valid !== null) {
            latestDateInDB = new Date(store.getState().rootReducer.reducer.filterConnections.max_valid);
            latestDateInDB = new Date(latestDateInDB.setDate(latestDateInDB.getDate() + 30));
        }
        //let listItems = [];
        let total = store.getState().rootReducer.reducer.filterConnections !== undefined ? store.getState().rootReducer.reducer.filterConnections.total : 1;
        let color = "grey";
        if(store.getState().rootReducer.reducer.filterConnections !== undefined && store.getState().rootReducer.reducer.filterConnections.total > 100000) {
            total = 100000;
        }
        return (
            <div className={"container-fluid"}>
                <div className={"visualization"} style={{backgroundColor: "white", top: "0"}}>
                    <div className={"visualization-Connections"} id={"visualization-Connections"}>
                        {(store.getState().rootReducer.reducer.filterConnections.results !== undefined
                            && store.getState().rootReducer.reducer.filterConnections.results !== null
                            && store.getState().rootReducer.reducer.filterConnections.results.length > 0 )
                            ?
                            store.getState().rootReducer.reducer.filterConnections.results.map((item, index) => {
                                return <Link to={"/connection/" + item.id} key={index}>
                                    <div style={{display: "none"}}>{color = item.connection_type_category.string_id.substring(0, 3)}</div>
                                    <div className={"Entity-Connections-row row"} key={index}>
                                        <div className={"col-12"}>
                                            <abbr className={"connection-type-abbr " + color} title={item.connection_type_category.name}>
                                                {item.connection_type_category.string_id.substring(0, 3).toUpperCase()}
                                            </abbr>
                                            <div className={"Entity-Connection-dates"}>
                                                {this.formatDate(item.valid_from)}{(item.valid_from || item.valid_to) && " - "}{this.formatDate(item.valid_to)}
                                            </div>
                                            <div className={"Entity-Connection-timeline"}>
                                                <div className={"Entity-Connection-timeline-gray"}>
                                                    <div
                                                        className={"Entity-Connection-timeline-color " + color.toUpperCase()+"background"}
                                                        style={{
                                                            width: this.calculateWidthTimeline(oldestDateInDB, latestDateInDB, item.valid_from, item.valid_to)+"%",
                                                            left: this.calculateLeftPositionTimeline(oldestDateInDB, latestDateInDB, item.valid_from)+"%",
                                                            display: this.calculateWidthTimeline(oldestDateInDB, latestDateInDB, item.valid_from, item.valid_to) !== null ? "block" : "none"
                                                        }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"col-12"} style={{textAlign: "left"}}>
                                            <span className={"Entity-Connection-entity"}>
                                                { item.entity_a.name}
                                            </span>
                                            <span className={"Entity-Connection-arrow " + color.toUpperCase()}>
                                                <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]}/>
                                            </span>
                                            <span className={"Entity-Connection-position"}>{item.connection_type.name}</span>
                                            <span className={"Entity-Connection-arrow " + color.toUpperCase()}>
                                                <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]}/>
                                            </span>
                                             <span className={"Entity-Connection-entity"}>
                                                {item.entity_b.name}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            })
                            :
                            store.getState().rootReducer.reducer.filterConnections.results === undefined
                            || store.getState().rootReducer.reducer.filterConnections.results === null ?
                                <div className={"visualization-Connections-empty"}>
                                    {Lang.FILTER_CONNECTIONS_IN_DB_WE_HAVE} {store.getState().rootReducer.reducer.statistics.result !== undefined && store.getState().rootReducer.reducer.statistics.result.connections_count.toLocaleString('fr-FR', {maximumFractionDigits: 0})} {Lang.CONNECTION_SMALLCAPS}.<br/>
                                    {Lang.FILTER_CONNECTIONS_PLEASE_USE_FILTER}
                                </div>
                                    :
                                    <div className={"visualization-Connections-empty"}>
                                        {Lang.FILTER_CONNECTIONS_NO_CONNECTIONS}
                                    </div>
                        }
                        <div className={"Filter-Pagination"} style={{display: (total !== undefined && total !== null  && total > 0 && Math.ceil(total / number_per_page) > 1) ? null : "none"}} key={this.state.getSearch}>
                            <ReactPaginate
                                previousLabel={Lang.PAGINATION_PREVIOUS}
                                nextLabel={Lang.PAGINATION_NEXT}
                                //breakLabel={<a href="">...</a>}
                                breakClassName={"break-me"}
                                pageCount={Math.ceil(total / number_per_page)}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                onPageChange={this.handlePageClick}
                                containerClassName={"pagination_container"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                                forcePage={this.state.page}
                            />
                            <div className={"Paginatation-more-div"}>{(store.getState().rootReducer.reducer.filterConnections !== undefined && store.getState().rootReducer.reducer.filterConnections.total > 100000)
                                ? Lang.MORE + ". " + Lang.TOTAL + " " + store.getState().rootReducer.reducer.filterConnections.total + " " + Lang.DATA_PLURAL
                                : ""}
                            </div>
                        </div>
                    </div>
                    <div className={"Filter-closeButton"}>
                        <Link to={'/'}>
                            Zatvori <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"times"}  style={{width: "16px", height: "16px"}}/></span>
                        </Link>
                    </div>
                </div>
                <div className={this.state.isVisibleFilter ? "Filter Filter-Body-shown" : "Filter Filter-Body-hidden"}>
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
                        <div className={"star-div"}
                             title={Lang.SAVE_CONNECTIONS_FILTER_TITLE}
                             style={{display: loadState("activeUser").activeUser.token !== undefined && loadState("activeUser").activeUser.token !== null && loadState("activeUser").activeUser.token !== ""
                                     ? "block" : "none"}}>
                            <Button onClick={() => this.saveLink(this.props.location.pathname + (this.state.str !== "" ? "?" : "") + this.state.str)}><span className={"grey-icon"}><FontAwesomeIcon icon={"star"}/></span><span>{Lang.SAVE_CONNECTIONS_FILTER}</span></Button>
                        </div>
                        <div>
                            <div className={"Filter-Connection-category"}>
                                <div className={"Filter-Connection-category-header"}> {Lang.FILTER_CONNECTIONS_CATEGORIES}</div>
                                <FilterEntityCheckboxTree params={this.state.nodesConnection}
                                                          location={this.props.location}
                                                          id={"1"}
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
                                        <input className={(this.isNumberFrom || this.state.valueFrom === "") ? "" : "wrongInput"} type="text" onChange={e => {
                                            e.preventDefault();
                                            this.updateValueFrom(e)
                                        }} value={this.state.valueFrom} name="valueFrom" id="Filter-Value-From" placeholder={Lang.FROM}/>
                                        <input className={(this.isNumberTo || this.state.valueTo === "") ? "" : "wrongInput"} type="text" onChange={e => {
                                            e.preventDefault();
                                            this.updateValueTo(e);
                                        }} value={this.state.valueTo} name="valueTo"
                                               id="Filter-Value-To" placeholder={Lang.TO}/>
                                    </form>
                                </div>
                            </div>
                            <div className={"Filter-Connection-category"}>
                                <div className={"Filter-Connection-category-header"}> {Lang.FILTER_CONNECTIONS_ENTITIES}</div>
                                <FilterEntityCheckboxTree params={this.state.nodesEntity}
                                                          location={this.props.location}
                                                          id={"2"}
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
                <FilterConnectionsRightColumn selected = {this.state.connectionSelected}/>
                {this.state.showModal ? <AddNameModal setModal={this.setModalShow} params={this.state.link}/> : null}
            </div>

        )
    }
}