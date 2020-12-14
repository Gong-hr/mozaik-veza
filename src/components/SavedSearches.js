import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import YesNoSearchModal from "./YesNoSearchModal"
import {NO_SAVED_SEARCHES, PAGINATION_PREVIOUS, PAGINATION_NEXT, MORE, TOTAL, DATA_PLURAL} from "../lang"
import ReactPaginate from 'react-paginate'
import {number_per_page_by_db} from "../config"

export default class SavedSearches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
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
                {this.props.params.results.length > 0 && this.props.params.results.map((item, index) => {
                    return <div key={index} className="">
                        <div className="Search-result-row col-sm-12" style={{minHeight: "32px"}}>
                            <div className={"Search-result-row-name"}>
                                <Link to={item.saved_url}>
                                    {item.name}
                                </Link>
                                <button onClick={() => this.openModal(item.id)} className={"Saved-Search-Fontawesome-holder"}>
                                    <FontAwesomeIcon className={"Saved-Search-star"} icon={"star"} />
                                </button>
                            </div>
                        </div>
                        <div className="w-100"></div>
                    </div>
                })}

                {total !== undefined && number_per_page_by_db !== undefined && total > number_per_page_by_db && <div style={{display: Math.ceil(total / number_per_page_by_db) < 2 ? 'none' : null}} >
                    <ReactPaginate
                        previousLabel={PAGINATION_PREVIOUS}
                        nextLabel={PAGINATION_NEXT}
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
                        ? MORE + ". " + TOTAL + " " + this.props.params.total !== undefined && this.props.params.total + " " + DATA_PLURAL
                        : ""}
                    </div>
                </div>}

                {this.props.params.results.length === 0 && <div style={{textAlign: "left"}}>{NO_SAVED_SEARCHES}</div>}
                {this.state.showModal ? <YesNoSearchModal setModal={this.setModalShow} params={[this.state.showModal, this.props.params.loggedIn.activeUser.token]} /> : null}
            </div>
        )
    }
}