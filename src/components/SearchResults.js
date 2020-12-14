import React, { Component } from 'react'
import { Form, FormGroup, Input, Label } from 'reactstrap'
import { Link } from 'react-router-dom'
import {number_per_page} from "../config"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import ReactPaginate from 'react-paginate'
import * as Lang from "../lang"

let person = false;
let legal = false;

const Result = ({ public_id, person_first_name, person_last_name, legal_entity_name, entity_type, count_imovinsko_pravna, count_poslovna, count_politicka, count_obiteljska, count_interesna, is_pep }) => (
    <div key={public_id} className="Search-result-row col-sm-12">
        <div className="Search-result-row-name">
            { entity_type.string_id === "person" ? person = true : person = false}
            { entity_type.string_id === "legal_entity" ? legal = true : legal = false}
            <Link to={'/entity/'+public_id}>
                {
                    person  ?
                        person_first_name !== undefined &&
                        person_first_name.map((first_name) => {
                            return  first_name.value+" "
                        })
                        :  ""
                }
                {
                    person_last_name !== undefined &&
                        person_last_name.map((last_name, index) => {
                            return last_name.value+" "
                        })
                }
                {
                    legal ?
                        legal_entity_name !== undefined &&
                        legal_entity_name.map((name, index) => {
                            return name.value+" "
                        })
                        :  ""
                }
            </Link>
        </div>
        <div className="w-100"></div>
        <div className="Search-result-row-details d-none d-md-block">
            <div className="Search-result-row-details-person">
                <span className={is_pep ? "pep" : ""}><FontAwesomeIcon icon={(entity_type.string_id === "person") ? "male" : "building"}/></span>
                {(entity_type.string_id === "person")
                    ?
                    entity_type.name === "Person" ? Lang.PERSON : entity_type.name
                    :
                    entity_type.name === "Legal Entity" ? Lang.LEGAL_ENTITY : entity_type.name}
            </div>
            <abbr className="connection-type-abbr imo" title={Lang.PROPERTY} style={{display: count_imovinsko_pravna < 1 ? 'none' : null}}>{Lang.PROPERTY3}</abbr>
            <div className="Search-result-row-details-number" style={{display: count_imovinsko_pravna < 1 ? 'none' : null}}>{count_imovinsko_pravna}</div>
            <abbr className="connection-type-abbr pos" title={Lang.BUSINESS} style={{display: count_poslovna < 1 ? 'none' : null}}>{Lang.BUSINESS3}</abbr>
            <div className="Search-result-row-details-number" style={{display: count_poslovna < 1 ? 'none' : null}}>{count_poslovna}</div>
            <abbr className="connection-type-abbr pol" title={Lang.POLITICAL} style={{display: count_politicka < 1 ? 'none' : null}}>{Lang.POLITICAL3}</abbr>
            <div className="Search-result-row-details-number" style={{display: count_politicka < 1 ? 'none' : null}}>{count_politicka}</div>
            <abbr className="connection-type-abbr obi" title={Lang.FAMILY} style={{display: count_obiteljska < 1 ? 'none' : null}}>{Lang.FAMILY3}</abbr>
            <div className="Search-result-row-details-number" style={{display: count_obiteljska < 1 ? 'none' : null}}>{count_obiteljska}</div>
            <abbr className="connection-type-abbr int" title={Lang.INTERESTS} style={{display: count_interesna < 1 ? 'none' : null}}>{Lang.INTERESTS3}</abbr>
            <div className="Search-result-row-details-number" style={{display: count_interesna < 1 ? 'none' : null}}>{count_interesna}</div>
        </div>
        <div className="Search-result-row-details d-md-none" style={{display: "block"}}>
            <div className="Search-result-row-details-person Search-result-row-details-person-sm">
                <span className={is_pep ? "pep" : ""}><FontAwesomeIcon icon={(entity_type.string_id === "person") ? "male" : "building"}/></span>
                {(entity_type.string_id === "person")
                    ?
                    entity_type.name === "Person" ? Lang.PERSON : entity_type.name
                    :
                    entity_type.name === "Legal Entity" ? Lang.LEGAL_ENTITY : entity_type.name}
            </div>
            <div className="Search-result-row-details-person Search-result-row-details-person-sm" style={{marginTop: "6px"}}>
                <abbr className="connection-type-abbr-round imo" title={Lang.PROPERTY} style={{display: count_imovinsko_pravna < 1 ? 'none' : null}}></abbr>
                <div className="Search-result-row-details-number" style={{display: count_imovinsko_pravna < 1 ? 'none' : null}}>{count_imovinsko_pravna}</div>
                <abbr className="connection-type-abbr-round pos" title={Lang.BUSINESS} style={{display: count_poslovna < 1 ? 'none' : null}}></abbr>
                <div className="Search-result-row-details-number" style={{display: count_poslovna < 1 ? 'none' : null}}>{count_poslovna}</div>
                <abbr className="connection-type-abbr-round pol" title={Lang.POLITICAL} style={{display: count_politicka < 1 ? 'none' : null}}></abbr>
                <div className="Search-result-row-details-number" style={{display: count_politicka < 1 ? 'none' : null}}>{count_politicka}</div>
                <abbr className="connection-type-abbr-round obi" title={Lang.FAMILY} style={{display: count_obiteljska < 1 ? 'none' : null}}></abbr>
                <div className="Search-result-row-details-number" style={{display: count_obiteljska < 1 ? 'none' : null}}>{count_obiteljska}</div>
                <abbr className="connection-type-abbr-round int" title={Lang.INTERESTS} style={{display: count_interesna < 1 ? 'none' : null}}></abbr>
                <div className="Search-result-row-details-number" style={{display: count_interesna < 1 ? 'none' : null}}>{count_interesna}</div>
            </div>
        </div>
        <div className="w-100"></div>
    </div>
);

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: Math.ceil(this.props.params.offset/this.props.params.limit),
            offset: 0,
            limit: number_per_page,
            total: 0
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.params.offset !== prevProps.params.offset) {
            this.setState({
                pageNumber: Math.ceil(this.props.params.offset/this.props.params.limit),
                offset: this.props.params.offset,
                limit: this.props.params.limit,
                total: this.props.total.results
            })
        }
    }
    getInputValue = () => {
        return this.input.value
    };
    setInputValue = (e) => {
        this.input.value = e
    };
    handleInputChange = (e) => {
        if (this.props.params.limit !== e.target.value) {
            this.setState({limit: e.target.value});
            this.props.handleLimitChange(this.props.params.term, 0, e.target.value);
        }
    };
    handlePageClick = (results) => {
        this.setState({pageNumber: results.selected});
        let selected = results.selected;
        let offset = Math.ceil(selected * this.state.limit);
        this.props.handleLimitChange(this.props.params.term, offset, this.state.limit);
    };

    render(){
        const dropdownPagination =
            <div className="Search-pagination">
                <Form>
                    <FormGroup>
                        <Label for="number_per_page">{Lang.SEARCH_NUMBER_OF_RESULTS}</Label>
                        <Input  ref={(input) => this.input = input} id={"number_per_page"} onChange={e => {
                            e.preventDefault();
                            this.handleInputChange(e)}} value= {this.state.limit} type={"select"} className="Search-pagination-input">
                            <option value={number_per_page}>{number_per_page}</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Input>
                        <span className={"caret-down"}></span>
                    </FormGroup>
                </Form>
            </div>;
        let total = 0;
        if(this.props.total !== undefined) total = this.props.total.results;
        if(this.props.total !== undefined && this.props.total.results > 100000) {
            total = 100000;
        }
        return(
            <div>
                <div className={"row"}>
                    <div className="col-xl-3 col-5 search-results-number">
                        <h3>
                            {this.props.total !== undefined && this.props.total.results} {(this.props.total !== undefined) && (this.props.total.results%10 === 1) && (this.props.total.results !== 11) ? Lang.ENTITY_SMALLCAPS : Lang.ENTITIES_SMALLCAPS}
                        </h3>
                    </div>
                    <div className={"col-xl-9 col-7"}>
                        {dropdownPagination}
                    </div>
                </div>
                {this.props.params !== undefined && this.props.results !== undefined && this.props.results.results !== [] && this.props.results.results.map((result, index) => (
                    <Result key={index} {...result} />
                ))}
                <div style={{display: this.props.params.limit !== undefined && Math.ceil(total/this.props.params.limit) < 2 ? 'none' : null}}>
                    <ReactPaginate
                        previousLabel={Lang.PAGINATION_PREVIOUS}
                        nextLabel={Lang.PAGINATION_NEXT}
                        pageCount={Math.ceil(total/this.state.limit)}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={2}
                        forcePage={parseInt(this.state.pageNumber, 10)}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination_container"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                    <div>
                    <div className={"Paginatation-more-div"}>{(this.props.params.total !== undefined && this.props.params.total.results !== undefined && this.props.params.total.results > 100000)
                        ? Lang.MORE + ". " + Lang.TOTAL + " " + this.props.params.total.results + " " + Lang.DATA_PLURAL
                        : ""}
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchResults;
