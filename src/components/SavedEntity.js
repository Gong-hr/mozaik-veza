import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import YesNoModal from './YesNoModal'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import * as Lang from "../lang"
import ReactPaginate from 'react-paginate'
import {number_per_page_by_db} from "../config"

export default class SavedEntity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            page: 0
        }
    }

    setModalShow = (e) => {
        this.setState({
            showModal: e
        })
    };

    openModal(e) {
        this.setState({
            showModal: e
        })
    };
    render() {
        let total = this.props.params.total;
        if(this.props.params.total > 100000) {
            total = 100000;
        }
        return (
            <div>
                {this.props.params.results !== undefined && this.props.params.results.map((item, index) => {
                    if(item.entity !== undefined && item.entity.entity_type !== undefined && item.entity.entity_type.string_id !== undefined) {
                        return <div key={index} className="">
                                <div key={index} className="Search-result-row col-sm-12">
                                    <div className="Search-result-row-name">
                                        <Link to={'/entity/' + item.entity.public_id}>
                                            {
                                                item.entity.entity_type.string_id === "person" &&
                                                (item.entity.person_first_name !== undefined &&
                                                item.entity.person_first_name.map((first_name) => {
                                                    return first_name.value + " "
                                                }))
                                            }
                                            {
                                                item.entity.entity_type.string_id === "person" &&
                                                (item.entity.person_last_name !== undefined &&
                                                item.entity.person_last_name.map((last_name, index) => {
                                                    return last_name.value + " "
                                                }))
                                            }
                                            {
                                                item.entity.entity_type.string_id === "person" &&
                                                item.entity.person_first_name === undefined &&
                                                item.entity.person_last_name === undefined &&
                                                <span className={"no_name"}>...</span>
                                            }
                                            {
                                                item.entity.entity_type.string_id === "legal_entity" &&
                                                (item.entity.legal_entity_name !== undefined ?
                                                item.entity.legal_entity_name.map((name, index) => {
                                                    return name.value + " "
                                                })
                                                    : <span className={"no_name"}>...</span>)
                                            }
                                            {
                                                item.entity.entity_type.string_id === "movable" &&
                                                (item.entity.movable_name !== undefined ?
                                                item.entity.movable_name.map((name, index) => {
                                                    return name.value + " "
                                                })
                                                : <span className={"no_name"}>...</span>)
                                            }
                                            {
                                                item.entity.entity_type.string_id === "real_estate" &&
                                                (item.entity.real_estate_name !== undefined ?
                                                item.entity.real_estate_name.map((name, index) => {
                                                    return name.value + " "
                                                })
                                                : <span className={"no_name"}>...</span>)
                                            }
                                            {
                                                item.entity.entity_type.string_id === "savings" &&
                                                (item.entity.savings_name !== undefined ?
                                                item.entity.savings_name.map((name, index) => {
                                                    return name.value + " "
                                                })
                                                : <span className={"no_name"}>...</span>)
                                            }
                                        </Link>
                                        <button onClick={() => this.openModal(item.entity.public_id)}
                                                className={"Saved-Search-Fontawesome-holder"}
                                                style={{top: "20px"}}>
                                            <FontAwesomeIcon className={"Saved-Search-star"} icon={"star"}/>
                                        </button>
                                    </div>
                                    <div className="w-100"></div>
                                    <div className="Search-result-row-details d-none d-md-block">
                                        <div className="Search-result-row-details-person">
                                            <span><FontAwesomeIcon
                                                icon={(item.entity.entity_type.string_id === "person") ? "male" : "building"}/></span>
                                                    {(item.entity.entity_type.string_id === "person")
                                                        ?
                                                        item.entity.entity_type.name === "Person" ? Lang.PERSON : item.entity.entity_type.name
                                                        :
                                                        item.entity.entity_type.name === "Legal Entity" ? Lang.LEGAL_ENTITY : item.entity.entity_type.name}
                                        </div>
                                            <abbr className="connection-type-abbr imo" title={Lang.PROPERTY}
                                                  style={{display: item.entity.count_imovinsko_pravna < 1 ? 'none' : null}}>{Lang.PROPERTY3}</abbr>
                                            <div className="Search-result-row-details-number"
                                                 style={{display: item.entity.count_imovinsko_pravna < 1 ? 'none' : null}}>{item.entity.count_imovinsko_pravna}</div>
                                            <abbr className="connection-type-abbr pos" title={Lang.BUSINESS}
                                                  style={{display: item.entity.count_poslovna < 1 ? 'none' : null}}>{Lang.BUSINESS3}</abbr>
                                            <div className="Search-result-row-details-number"
                                                 style={{display: item.entity.count_poslovna < 1 ? 'none' : null}}>{item.entity.count_poslovna}</div>
                                            <abbr className="connection-type-abbr pol" title={Lang.POLITICAL}
                                                  style={{display: item.entity.count_politicka < 1 ? 'none' : null}}>{Lang.POLITICAL3}</abbr>
                                            <div className="Search-result-row-details-number"
                                                 style={{display: item.entity.count_politicka < 1 ? 'none' : null}}>{item.entity.count_politicka}</div>
                                            <abbr className="connection-type-abbr obi" title={Lang.FAMILY}
                                                  style={{display: item.entity.count_obiteljska < 1 ? 'none' : null}}>{Lang.FAMILY3}</abbr>
                                            <div className="Search-result-row-details-number"
                                                 style={{display: item.entity.count_obiteljska < 1 ? 'none' : null}}>{item.entity.count_obiteljska}</div>
                                            <abbr className="connection-type-abbr int" title={Lang.INTERESTS}
                                                  style={{display: item.entity.count_interesna < 1 ? 'none' : null}}>{Lang.INTERESTS3}</abbr>
                                            <div className="Search-result-row-details-number"
                                                 style={{display: item.entity.count_interesna < 1 ? 'none' : null}}>{item.entity.count_interesna}</div>
                                    </div>
                                    <div className="Search-result-row-details d-md-none" style={{display: "block"}}>
                                        <div className="Search-result-row-details-person Search-result-row-details-person-sm">
                                            <span><FontAwesomeIcon icon={(item.entity.entity_type.string_id === "person") ? "male" : "building"}/></span>
                                            {(item.entity.entity_type.string_id === "person")
                                                ?
                                                item.entity.entity_type.name === "Person" ? Lang.PERSON : item.entity.entity_type.name
                                                :
                                                item.entity.entity_type.name === "Legal Entity" ? Lang.LEGAL_ENTITY: item.entity.entity_type.name}
                                        </div>
                                        <div className="Search-result-row-details-person Search-result-row-details-person-sm" style={{marginTop: "6px"}}>
                                            <abbr className="connection-type-abbr-round imo" title={Lang.PROPERTY} style={{display: item.entity.count_imovinsko_pravna < 1 ? 'none' : null}}></abbr>
                                            <div className="Search-result-row-details-number" style={{display: item.entity.count_imovinsko_pravna < 1 ? 'none' : null}}>{item.entity.count_imovinsko_pravna}</div>
                                            <abbr className="connection-type-abbr-round pos" title={Lang.BUSINESS} style={{display: item.entity.count_poslovna < 1 ? 'none' : null}}></abbr>
                                            <div className="Search-result-row-details-number" style={{display: item.entity.count_poslovna < 1 ? 'none' : null}}>{item.entity.count_poslovna}</div>
                                            <abbr className="connection-type-abbr-round pol" title={Lang.POLITICAL} style={{display: item.entity.count_politicka < 1 ? 'none' : null}}></abbr>
                                            <div className="Search-result-row-details-number" style={{display: item.entity.count_politicka < 1 ? 'none' : null}}>{item.entity.count_politicka}</div>
                                            <abbr className="connection-type-abbr-round obi" title={Lang.FAMILY} style={{display: item.entity.count_obiteljska < 1 ? 'none' : null}}></abbr>
                                            <div className="Search-result-row-details-number" style={{display: item.entity.count_obiteljska < 1 ? 'none' : null}}>{item.entity.count_obiteljska}</div>
                                            <abbr className="connection-type-abbr-round int" title={Lang.INTERESTS} style={{display: item.entity.count_interesna < 1 ? 'none' : null}}></abbr>
                                            <div className="Search-result-row-details-number" style={{display: item.entity.count_interesna < 1 ? 'none' : null}}>{item.entity.count_interesna}</div>
                                        </div>
                                    </div>
                                    <div className="w-100"></div>
                                </div>

                        </div>
                    }
                    else {
                        return null
                    }
                })}


                {total !== undefined && number_per_page_by_db !== undefined && total > number_per_page_by_db && <div style={{display: Math.ceil(total / number_per_page_by_db) < 2 ? 'none' : null}} >
                    <ReactPaginate
                        previousLabel={Lang.PAGINATION_PREVIOUS}
                        nextLabel={Lang.PAGINATION_NEXT}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(total / number_per_page_by_db)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.props.handlePageClick}
                        containerClassName={"pagination_container"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        forcePage={this.state.page}
                    />
                    <div className={"Paginatation-more-div"}>{(this.props.params.total !== undefined && this.props.params.total > 100000)
                        ? Lang.MORE + ". " + Lang.TOTAL + " " + this.props.params.total !== undefined && this.props.params.total + " " + Lang.DATA_PLURAL
                        : ""}
                    </div>
                </div>}

                {this.props.params.results.length === 0 &&
                    <div style={{textAlign: "left"}}>{Lang.NO_FOLLOWED_ENTITIES}</div>}
                {this.state.showModal ? <YesNoModal setModal={this.setModalShow} params={[this.state.showModal, this.props.params.loggedIn.activeUser.token]} /> : null}
            </div>
        )
    }
}