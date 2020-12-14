import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {store} from "../index"
import {deleteConnectionData, entityEntityConnections} from "../actions"
import { Link } from 'react-router-dom'
import * as Lang from "../lang"
import ReactPaginate from 'react-paginate'
import { number_per_page_by_db } from "../config"

export default class FilterConnectionsRightColumn extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showConnectionDetails: false,
            connection: "",
            page: 0,
            results : [],
            total : 0,
            entity_a : null,
            entity_b : null,
        }
    }


    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                results : store.getState().rootReducer.reducer.entityEntityConnectionsData.results,
                total : store.getState().rootReducer.reducer.entityEntityConnectionsData.total,
                entity_a : store.getState().rootReducer.reducer.entityEntityConnectionsData.results !== undefined && store.getState().rootReducer.reducer.entityEntityConnectionsData.results[0] !== undefined && store.getState().rootReducer.reducer.entityEntityConnectionsData.results[0].entity_a.public_id,
                entity_b : store.getState().rootReducer.reducer.entityEntityConnectionsData.results !== undefined && store.getState().rootReducer.reducer.entityEntityConnectionsData.results[0] !== undefined && store.getState().rootReducer.reducer.entityEntityConnectionsData.results[0].entity_b.public_id,
            })
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.entity_a !== this.state.entity_a || prevState.entity_b !== this.state.entity_b) {
            this.setState({
                page: 0
            })
        }
    }

    hideComponent() {
        if(this.state.showConnectionDetails) {
            this.setState({
                showConnectionDetails: false,
                connection: ""
            });
        }
        else {
            store.dispatch(deleteConnectionData());
        }
    }

    showConnection(connection) {
        if(connection !== undefined && connection.id !== undefined) {
            this.setState({
                showConnectionDetails: true,
                connection: connection
            });
            this.props.diselect(false);
        }
    }

    formatDate(date) {
        if(date !== undefined && date !== null) {
            let tmp_date = new Date(date);
            let tmp_day = tmp_date.getDate();
            let tmp_month = tmp_date.getMonth() + 1;
            let tmp_year = tmp_date.getFullYear();
            return tmp_day + ".\xa0" + tmp_month + ".\xa0" + tmp_year + ".";// Non-breakable space is char 0xa0
        }
        else return "";
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        this.setState({page: selected});
        let offset = Math.ceil(selected * number_per_page_by_db);
        store.dispatch(entityEntityConnections(this.state.entity_a, this.state.entity_b,"", offset, number_per_page_by_db));
    };

    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        if(this.state.showConnectionDetails && this.props.selected) {
            this.hideComponent();
        }

        const showConnections = this.state.results !== undefined && this.state.total > 1;
        let listItems = [];
        let connectionDetails = "";
        let iconType = "grey";
        let prev = <FontAwesomeIcon icon={"chevron-left"}/>;
        let next = <FontAwesomeIcon icon={"chevron-right"}/>;

        if(showConnections && !this.state.showConnectionDetails) {
            listItems = this.state.results.map((connection, index) =>
                <div className="Connection-right-column-related-Connection" key={index} >
                    <div style={{display: "none"}}>{iconType =  connection.connection_type_category.string_id.substring(0, 3)}</div>
                    <div onClick={() => this.showConnection(connection/*[2].id*/)}>
                        <abbr className={"connection-type-abbr " + iconType} title={connection.connection_type_category.name}>
                            {iconType.toUpperCase()}
                        </abbr>
                        <div className={"Connection-right-column-related-Connection-dates"}>
                            {" "}{this.formatDate(connection.valid_from)} {(connection.valid_to !== undefined && connection.valid_to !== null) && " - "} {this.formatDate(connection.valid_to)}
                        </div>
                        <div className={"Connection-right-column-related-Connection-info"}>
                            <div className={"image-div"}>
                                <div className={"crta " + iconType.toUpperCase() + "background"}></div>
                                <div className={"krug " + iconType.toUpperCase() + "background"}></div>
                            </div>
                            <div className={"Connection-right-column-related-Connection-info-div"}>
                                <p className="Connection-right-column-related-Connection-name">{connection.entity_a.name}</p>
                                <p className="Connection-right-column-related-Connection-position">{connection.connection_type.name}</p>
                                <p className="Connection-right-column-related-Connection-name">{connection.entity_b.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.showConnectionDetails) {
            //let id = this.state.connection.entity_b.public_id;
            let validFromTo = "";
            let transactionDate = "";
            let transactionAmount = "";
            let entity_a_type = "building";
            let entity_a_type_name = Lang.LEGAL_ENTITY;
            let entity_b_type = "building";
            let entity_b_type_name = Lang.LEGAL_ENTITY;
            if (this.state.connection !== undefined && this.state.connection !== null && this.state.connection !== '') {
                if (this.state.connection.entity_a !== undefined && this.state.connection.entity_a !== null) {
                    if (this.state.connection.entity_a.entity_type.string_id === "person") {
                        entity_a_type = "male";
                        entity_a_type_name = Lang.PERSON;
                    }
                    else if (this.state.connection.entity_a.entity_type.string_id === "real_estate") {
                        entity_a_type = "home";
                        entity_a_type_name = Lang.REALESTATE;
                    }
                    else if (this.state.connection.entity_a.entity_type.string_id === "movable") {
                        entity_a_type = "car";
                        entity_a_type_name = Lang.MOVABLE;
                    }
                    else if (this.state.connection.entity_a.entity_type.string_id === "savings") {
                        entity_a_type = "piggy-bank";
                        entity_a_type_name = Lang.SAVINGS;
                    }
                }
                if (this.state.connection.entity_b !== undefined && this.state.connection.entity_b !== null) {
                    if (this.state.connection.entity_b.entity_type.string_id === "person") {
                        entity_b_type = "male";
                        entity_b_type_name = Lang.PERSON;
                    }
                    else if (this.state.connection.entity_b.entity_type.string_id === "real_estate") {
                        entity_b_type = "home";
                        entity_b_type_name = Lang.REALESTATE;
                    }
                    else if (this.state.connection.entity_b.entity_type.string_id === "movable") {
                        entity_b_type = "car";
                        entity_b_type_name = Lang.MOVABLE;
                    }
                    else if (this.state.connection.entity_b.entity_type.string_id === "savings") {
                        entity_b_type = "piggy-bank";
                        entity_b_type_name = Lang.SAVINGS;
                    }
                }
            }
            if(this.state.connection !== undefined) {
                iconType = this.state.connection.connection_type_category.string_id.substring(0, 3);
                let valid_from_to = "";
                if(this.state.connection.valid_from !== null) {
                    valid_from_to = this.formatDate(this.state.connection.valid_from);
                }
                if(this.state.connection.valid_to !== null ) {
                    valid_from_to += "\xa0-\xa0" + this.formatDate(this.state.connection.valid_to);// Non-breakable space is char 0xa0
                }
                validFromTo =
                    ((this.state.connection.valid_from !== undefined && this.state.connection.valid_from !== null)
                        || (this.state.connection.valid_to !== undefined && this.state.connection.valid_to !== null)) ? <div>
                        <div className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{Lang.DURATION}: </span>
                            <span>{valid_from_to} </span>
                            {/*<div className="font-awesome-holder"><FontAwesomeIcon icon={"external-link-alt"} /></div>*/}
                        </div>
                    </div> : "";
                
                transactionAmount =
                    (this.state.connection.transaction_amount !== undefined && this.state.connection.transaction_amount !== null) ? <div>
                        <div className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{Lang.TRANSACTION_AMOUNT}: </span>
                            <span>{this.state.connection.transaction_amount.toLocaleString('de-DE', { minimumFractionDigits: 2})} {this.state.connection.transaction_currency.sign !== null && this.state.connection.transaction_currency.sign} </span>
                            {/*<div className="font-awesome-holder"><FontAwesomeIcon icon={"external-link-alt"} /></div>*/}
                        </div>
                    </div> : "";
                let transaction_date = null;
                if(this.state.connection.transaction_date !== undefined && this.state.connection.transaction_date !== null) {
                    transaction_date =  this.formatDate(this.state.connection.transaction_date);
                }
                transactionDate =
                    transaction_date !== undefined && transaction_date !== null ? <div>
                        <div className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{Lang.TRANSACTION_DATES}: </span>
                            <span>{transaction_date} </span>
                            {/*<div className="font-awesome-holder"><FontAwesomeIcon icon={"external-link-alt"} /></div>*/}
                        </div>
                    </div> : "";
            }
            connectionDetails =
                <div className={"Connection-container"}>
                    <h1>
                        {this.state.connection !== undefined && this.state.connection.connection_type_category.name} {Lang.CONNECTION_SMALLCAPS}
                    </h1>
                    <h2>
                        <span>{/*<FontAwesomeIcon icon={"eye"} /> Detalji zapisa*/}</span>
                    </h2>
                    <div className="row empty-row"></div>
                    <h2>
                        <Link to={'/entity/'+(this.state.connection !== undefined && this.state.connection[0] !== null && this.state.connection.entity_a.public_id)} target={"_blank"}>
                            {this.state.connection !== undefined &&

                            (this.state.connection.entity_a !== null ?
                                this.state.connection.entity_a.name
                                : "")
                            }
                        </Link>
                    </h2>
                    <p>
                        <span>
                            <FontAwesomeIcon icon={entity_a_type}/>
                        </span>
                        {entity_a_type_name}
                    </p>
                    <div className={"Connection-ConnectionInfo"}>
                        <div className={"image-div"}>
                            <div className={"crta " + iconType.toUpperCase() + "background"}></div>
                            <div className={"krug " + iconType.toUpperCase() + "background"}></div>
                        </div>
                        <div /*to={'/connection/'+(this.state.connection !== undefined && this.state.connection.id !== null && this.state.connection.id)} target={"_blank"}*/>
                            <h2>
                                <span>{this.state.connection !== undefined && this.state.connection.connection_type.name}</span>
                                <abbr className={"connection-type-abbr " + iconType} title={this.state.connection.connection_type_category.name}>
                                    {iconType.toUpperCase()}
                                </abbr>
                            </h2>
                        </div>
                        {validFromTo}
                        {transactionAmount}
                        {transactionDate}
                    </div>
                    <h2>
                        <Link to={'/entity/'+(this.state.connection !== undefined && this.state.connection.entity_b !== null && this.state.connection.entity_b.public_id)} target={"_blank"}>
                            {this.state.connection !== undefined &&
                            (this.state.connection.entity_b !== null ?
                                this.state.connection.entity_b.name
                                : "")
                            }
                        </Link>
                    </h2>
                    <p>
                        <span>
                            <FontAwesomeIcon icon={entity_b_type}/>
                        </span>
                        {entity_b_type_name}
                    </p>
                    <div className="Filter-Entity-right-details-more-div">
                        <Link to={'/connection/'+(this.state.connection !== undefined && this.state.connection.id !== null && this.state.connection.id)} target={"_blank"}>
                            {Lang.OPEN_CONNECTION}
                            <div className="font-awesome-holder"><FontAwesomeIcon icon={"long-arrow-alt-right"}/></div>
                        </Link>
                    </div>
                </div>
        }
        else if(this.state.total === 1) {
            let validFromTo = "";
            let transactionDate = "";
            let transactionAmount = "";
            let entity_a_type = "building";
            let entity_a_type_name = Lang.LEGAL_ENTITY;
            let entity_b_type = "building";
            let entity_b_type_name = Lang.LEGAL_ENTITY;
            if (this.state.results[0] !== undefined && this.state.results[0] !== null && this.state.results[0] !== '') {
                if (this.state.results[0].entity_a !== undefined && this.state.results[0].entity_a !== null) {
                    if (this.state.results[0].entity_a.entity_type.string_id === "person") {
                        entity_a_type = "male";
                        entity_a_type_name = Lang.PERSON;
                    }
                    else if (this.state.results[0].entity_a.entity_type.string_id === "real_estate") {
                        entity_a_type = "home";
                        entity_a_type_name = Lang.REALESTATE;
                    }
                    else if (this.state.results[0].entity_a.entity_type.string_id === "movable") {
                        entity_a_type = "car";
                        entity_a_type_name = Lang.MOVABLE;
                    }
                    else if (this.state.results[0].entity_a.entity_type.string_id === "savings") {
                        entity_a_type = "piggy-bank";
                        entity_a_type_name = Lang.SAVINGS;
                    }
                }
                if (this.state.results[0].entity_b !== undefined && this.state.results[0].entity_b !== null) {
                    if (this.state.results[0].entity_b.entity_type.string_id === "person") {
                        entity_b_type = "male";
                        entity_b_type_name = Lang.PERSON;
                    }
                    else if (this.state.results[0].entity_b.entity_type.string_id === "real_estate") {
                        entity_b_type = "home";
                        entity_b_type_name = Lang.REALESTATE;
                    }
                    else if (this.state.results[0].entity_b.entity_type.string_id === "movable") {
                        entity_b_type = "car";
                        entity_b_type_name = Lang.MOVABLE;
                    }
                    else if (this.state.results[0].entity_b.entity_type.string_id === "savings") {
                        entity_b_type = "piggy-bank";
                        entity_b_type_name = Lang.SAVINGS;
                    }
                }
            }
            if(this.state.results[0] !== undefined) {
                iconType = this.state.results[0].connection_type_category.string_id.substring(0, 3);
                let valid_from_to = "";
                if(this.state.results[0].valid_from !== null) {
                    valid_from_to = this.formatDate(this.state.results[0].valid_from);
                }
                if(this.state.results[0].valid_to !== null ) {
                    valid_from_to += "\xa0-\xa0" + this.formatDate(this.state.results[0].valid_to);// Non-breakable space is char 0xa0
                }
                validFromTo =
                    ((this.state.results[0].valid_from !== undefined && this.state.results[0].valid_from !== null)
                        || (this.state.results[0].valid_to !== undefined && this.state.results[0].valid_to !== null)) ? <div>
                        <div className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{Lang.DURATION}: </span>
                            <span>{valid_from_to} </span>
                            {/*<div className="font-awesome-holder"><FontAwesomeIcon icon={"external-link-alt"} /></div>*/}
                        </div>
                    </div> : "";

                transactionAmount =
                    (this.state.results[0].transaction_amount !== undefined && this.state.results[0].transaction_amount !== null) ? <div>
                        <div className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{Lang.TRANSACTION_AMOUNT}: </span>
                            <span>{this.state.results[0].transaction_amount.toLocaleString('de-DE', { minimumFractionDigits: 2})} {this.state.results[0].transaction_currency.sign !== null && this.state.results[0].transaction_currency.sign} </span>
                            {/*<div className="font-awesome-holder"><FontAwesomeIcon icon={"external-link-alt"} /></div>*/}
                        </div>
                    </div> : "";
                if(this.state.results[0].transaction_date !== null) {
                    var transaction_date2 =  this.formatDate(this.state.results[0].transaction_date);
                }
                transactionDate =
                    transaction_date2 !== undefined && transaction_date2 !== null ? <div>
                        <div className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{Lang.TRANSACTION_DATES}: </span>
                            <span>{transaction_date2} </span>
                            {/*<div className="font-awesome-holder"><FontAwesomeIcon icon={"external-link-alt"} /></div>*/}
                        </div>
                    </div> : "";
            }
            connectionDetails =
                <div className={"Connection-container"}>
                    <h1>
                        {this.state.results[0] !== undefined && this.state.results[0].connection_type_category.name} {Lang.CONNECTION_SMALLCAPS}
                    </h1>
                    <h2>
                        <span>{/*<FontAwesomeIcon icon={"eye"} /> Detalji zapisa*/}</span>
                    </h2>
                    <div className="row empty-row"></div>
                    <h2>
                        <Link to={'/entity/'+(this.state.results[0] !== undefined && this.state.results[0].entity_a !== null && this.state.results[0].entity_a.public_id)} target={"_blank"}>
                            {this.state.results[0] !== undefined &&

                            (this.state.results[0].entity_a !== null ?
                                this.state.results[0].entity_a.name
                                : "")
                            }
                        </Link>
                    </h2>
                    <p>
                        <span>
                            <FontAwesomeIcon icon={entity_a_type}/>
                        </span>
                        {entity_a_type_name }
                    </p>
                    <div className={"Connection-ConnectionInfo"}>
                        <div className={"image-div"}>
                            <div className={"crta " + iconType.toUpperCase() + "background"}></div>
                            <div className={"krug " + iconType.toUpperCase() + "background"}></div>
                        </div>
                        <div /*to={'/connection/'+(this.state.results[0] !== undefined && this.state.results[0].id !== null && this.state.results[0].id)} target={"_blank"}*/>
                            <h2>
                                <span>{this.state.results[0] !== undefined && this.state.results[0].connection_type.name}</span>
                                <abbr className={"connection-type-abbr " + iconType} title={this.state.results[0].connection_type_category.name}>
                                    {iconType.toUpperCase()}
                                </abbr>
                            </h2>
                        </div>
                        {validFromTo}
                        {transactionAmount}
                        {transactionDate}
                    </div>
                    <h2>
                        <Link to={'/entity/'+(this.state.results[0] !== undefined && this.state.results[0].entity_b !== null && this.state.results[0].entity_b.public_id)} target={"_blank"}>
                            {this.state.results[0] !== undefined &&
                            (this.state.results[0].entity_b !== null ?
                                this.state.results[0].entity_b.name
                                : "")
                            }
                        </Link>
                    </h2>
                    <p>
                        <span>
                            <FontAwesomeIcon icon={entity_b_type}/>
                        </span>
                        {entity_b_type_name}
                    </p>
                    <div className="Filter-Entity-right-details-more-div">
                        <Link to={'/connection/'+(this.state.results[0] !== undefined && this.state.results[0].id !== null && this.state.results[0].id)} target={"_blank"}>
                            {Lang.OPEN_CONNECTION}
                            <div className="font-awesome-holder"><FontAwesomeIcon icon={"long-arrow-alt-right"}/></div>
                        </Link>
                    </div>
                </div>
        }
        let total = this.state.total;
        if(this.state.total > 100000) {
            total = 100000;
        }
        return (
            <div className={"Filter-Entity-right"} style={{display: (showConnections || this.state.total === 1 ) ? "block" : "none"}}>
                <div className={"Filter-Entity-right-Header"}>
                    <span className={"Filter-Entity-right-Header-title"}>Veze </span>
                    <div className={"Filter-Entity-right-Header-close"}>
                        <button style={{background: "transparent", border:"none"}} onClick={() => this.hideComponent()}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon icon={this.state.showConnectionDetails ? "arrow-left" : "times"}/></span>
                        </button>
                    </div>
                </div>
                <div className={"Filter-Link-right-details"}>
                    {this.state.total !== 1 && listItems}
                    {total > 1 && !this.state.showConnectionDetails &&
                        <div style={{display: Math.ceil(total / number_per_page_by_db) < 2 ? 'none' : null}} className={"Pagination-small"}>
                            <ReactPaginate
                                previousLabel={prev}
                                nextLabel={next}
                                breakClassName={"break-me"}
                                pageCount={Math.ceil(total / number_per_page_by_db)}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                onPageChange={this.handlePageClick}
                                containerClassName={"pagination_container"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                                forcePage={this.state.page}
                            />
                            <div className={"Paginatation-more-div"}>{(this.state.total !== undefined && this.state.total > 100000)
                                ? Lang.MORE + ". " + Lang.TOTAL + " " + this.state.total + " " + Lang.DATA_PLURAL
                                : ""}
                            </div>
                        </div>}
                    {connectionDetails}
                </div>
            </div>
        )
    }
}
