import React, {Component} from 'react'
import { Form, FormGroup, Input, Label } from 'reactstrap'
import {default_url, number_per_page} from "../config"
import {entityConnections/*, filterConnections, entityConnectionTypeCategories*/} from "../actions"
import ReactPaginate from 'react-paginate'
import {Link} from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
//import {store} from "../index";
import * as Lang from "../lang"

export default class EntityConnections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth, //for timeline size, to calculate colored size
            filter: "",
            order_by: "",
            order_direction: "",
            page: 0
        };
    }

    componentDidMount() {
        this.setState({
            filter: this.props.params.filter,
            order_by: this.props.params.order_by,
            order_direction: this.props.params.order_direction
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if((prevProps.params.filter !== this.props.params.filter && prevState.filter !== this.state.filter) || this.props.params.filter !== this.state.filter ) {
            this.setState({
                filter: this.props.params.filter,
                page: 0
            });
        }
        if((prevProps.params.order_by !== this.props.params.order_by && prevState.order_by !== this.state.order_by) || this.props.params.order_by !== this.state.order_by) {
            this.setState({
                order_by: this.props.params.order_by,
                page: 0
            })
        }
        if((prevProps.params.order_direction !== this.props.params.order_direction && prevState.order_direction !== this.state.order_direction) || this.props.params.order_direction !== this.state.order_direction ) {
            this.setState({
                order_direction: this.props.params.order_direction,
                page: 0
            })
        }
    }

    /*resize() {
        this.setState({
            windowWidth: window.innerWidth
        });
    }*/

    handlePageClick = (results) => {
        let selected = results.selected;
        this.setState({page: selected});
        let offset = Math.ceil(selected * number_per_page);
        const {dispatch, params} = this.props.params;
        const {filter, order_by, order_direction} = this.state;
        dispatch(entityConnections(params.id, offset, number_per_page, filter, order_by, order_direction));//!!!!!
    };

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
            let tmp_result = 100 * diff2 / diff1;
            return tmp_result;
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

    handleSortConnectionChange(e) {
        if(e.target.value === "none" || e.target.value === "") {
            this.setState({
                order_by: "",
                order_direction: ""
            });
            this.props.params.handleSortConnectionChange("");
        }
        else {
            const index = e.target.value.lastIndexOf("_");
            this.setState({
                order_by: e.target.value.substring(0, index),
                order_direction: e.target.value.substring(index+1)
            });
            this.props.params.handleSortConnectionChange(e.target.value);
        }
    }

    handleConnectionTypeChange(e) {
        if(e.target.value !== this.state.filter) {
            this.setState({ filter: e.target.value });
            this.props.params.handleConnectionTypeChange(e.target.value);
        }
    }

    render() {
        let oldestDateInDB = "";
        let latestDateInDB = new Date();
        if(this.props.params.min_valid !== undefined && this.props.params.min_valid.results !== null) {
            oldestDateInDB = new Date(this.props.params.min_valid.results);
            oldestDateInDB = new Date(oldestDateInDB.setDate(oldestDateInDB.getDate() - 30));
        }
        if(this.props.params.max_valid !== undefined && this.props.params.max_valid.results !== null) {
            latestDateInDB = new Date(this.props.params.max_valid.results);
            latestDateInDB = new Date(latestDateInDB.setDate(latestDateInDB.getDate() + 30));
        }
        let listItems = [];
        let tmp_id = "";
        let tmp_a = "";
        let total = this.props.params.total !== undefined && this.props.params.total.results !== undefined ? this.props.params.total.results : 1;
        if(this.props.params.total !== undefined && this.props.params.total.results !== undefined && this.props.params.total.results > 100000) {
            total = 100000;
        }
        let color = "grey";
        if (this.props.params.results.results !== undefined) {
            listItems = this.props.params.results.results.map((result, index) =>
                <Link to={"/connection/" + result.id} key={index}>
                    <div style={{display: "none"}}>{color = result.connection_type_category.string_id.substring(0, 3)}</div>
                    <div className={"Entity-Connections-row row"} key={index}>
                        <div className={"col-12"}>
                            <abbr className={"connection-type-abbr " + color} title={result.connection_type_category.name}>
                                {result.connection_type_category.string_id.substring(0, 3).toUpperCase()}
                            </abbr>
                            <div className={"Entity-Connection-dates"}>
                                {this.formatDate(result.valid_from)}{(result.valid_from || result.valid_to) && " - " }{this.formatDate(result.valid_to)}
                            </div>
                            <div className={"Entity-Connection-timeline"}>
                                <div className={"Entity-Connection-timeline-gray"}>
                                    <div
                                        className={"Entity-Connection-timeline-color " + color.toUpperCase()+"background"}
                                        style={{
                                            width: this.calculateWidthTimeline(oldestDateInDB, latestDateInDB, result.valid_from, result.valid_to)+"%",
                                            left: this.calculateLeftPositionTimeline(oldestDateInDB, latestDateInDB, result.valid_from)+"%",
                                            display: this.calculateWidthTimeline(oldestDateInDB, latestDateInDB, result.valid_from, result.valid_to) !== null ? "block" : "none"
                                        }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"col-12"}>
                            <span className={"Entity-Connection-position"}>{result.connection_type.name}</span>
                            <span className={"Entity-Connection-arrow " + color.toUpperCase()}>
                                {/*&#10132;*/}
                                <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]}/>
                            </span>
                            <span style={{display: "none"}}>
                                {tmp_id = this.props.params.params.id}
                                {tmp_a = result.entity_a.public_id}
                            </span>
                            <span className={"Entity-Connection-entity"}>
                                {tmp_id === tmp_a ? result.entity_b.name : result.entity_a.name}
                            </span>
                        </div>
                    </div>
                </Link>
            )
        }
        const dropdownConnectionType =
            <div className="Entity-ConnectionType-dropdown">
                <Form inline>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="connection_types" className="mr-sm-2">{Lang.SHOW} </Label>
                        <Input  /*ref={(input) => this.input = input}*/ value={this.state.filter} id={"connection_types"} onChange={e => {
                            e.preventDefault();
                            this.handleConnectionTypeChange(e)}} /*value= {this.props.params.params.limit}*/ type={"select"} style={{backgroundPositionX: "100px"}} className="Search-pagination-input">
                            <option value={""}>{Lang.ALL}</option>
                            {this.props.params.categories !== undefined && this.props.params.categories.map((item, index) => {
                                return <option key={index} value={item.string_id}>{item.name}</option>
                            })}
                        </Input>
                    </FormGroup>
                    <FormGroup className="mb-2 mb-sm-0 ml-4">
                        <Label for="sort_connections" className="mr-sm-2">{Lang.SORT}</Label>
                        <Input  ref={(input) => this.input = input}
                                id={"sort_connections"}
                                onChange={e => {
                                    e.preventDefault();
                                    this.handleSortConnectionChange(e)}}
                                value= {this.state.order_by + (this.state.order_by !== "" ? "_" : "") + this.state.order_direction}
                                type={"select"} style={{backgroundPositionX: "62px"}}
                                className="Search-pagination-input">
                            <option value={"none"} title={Lang.DEFAULT}>{""}</option>
                            <option value={"valid_from_asc"} title={Lang.VALID_FROM_ASC}>{Lang.VALID_FROM+" "+String.fromCharCode(0x2191)}</option>
                            <option value={"valid_from_desc"} title={Lang.VALID_FROM_DESC}>{Lang.VALID_FROM+" "+String.fromCharCode(0x2193)}</option>
                            <option value={"valid_to_asc"} title={Lang.VALID_TO_ASC}>{Lang.VALID_TO+" "+String.fromCharCode(0x2191)}</option>
                            <option value={"valid_to_desc"} title={Lang.VALID_TO_DESC}>{Lang.VALID_TO+" "+String.fromCharCode(0x2193)}</option>
                            <option value={"transaction_amount_asc"} title={Lang.AMOUNT_ASC}>{Lang.AMOUNT+" "+String.fromCharCode(0x2191)}</option>
                            <option value={"transaction_amount_desc"} title={Lang.AMOUNT_DESC}>{Lang.AMOUNT+" "+String.fromCharCode(0x2193)}</option>
                        </Input>
                    </FormGroup>
                </Form>
            </div>;
        const icon = <FontAwesomeIcon icon={"download"}/>;
        return (
            <div className={"Entity-Connections"} >
                <div className={"numberEntityConnections"}>
                    <div className="row empty-row"></div>
                    <div className="row empty-row"></div>
                    <h2>{total > 0 ? total : "0"}
                        {((total%10) === 2 || (total%10) === 3 || (total%10)===4)
                        && (total<10 || total>20) ?
                            " "+Lang.CONNECTIONS : " "+Lang.CONNECTION}</h2>
                    <div className="row empty-row"></div>
                </div>
                <div className={"Entity-left-column-Connections-title"}>
                    <h2>
                        {Lang.CONN_LIST}
                        <a href={default_url + "/search/connections/by-end/" + this.props.params.params.id + "/?format=json&full=true&as_file=true"} target={"_blank"}><span className={"font-awesome-button"}>{icon}</span></a>
                    </h2>
                    {dropdownConnectionType}
                    <div className={"Entity-left-column-filter"}>
                        <div></div>
                    </div>
                </div>
                <div /*style={{display: total < 1 ? 'none' : null}}*/>
                    {listItems}
                </div>
                <div style={{display: Math.ceil(total / number_per_page) < 2 ? 'none' : null}}>
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
                    <div className={"Paginatation-more-div"}>{(this.props.params.total !== undefined && this.props.params.total.results !== undefined && this.props.params.total.results > 100000)
                        ? Lang.MORE + ". " + Lang.TOTAL + " " + this.props.params.total.results + " " + Lang.DATA_PLURAL
                        : ""}
                    </div>
                </div>
            </div>

        );
    }
}
