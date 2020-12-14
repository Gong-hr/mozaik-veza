import React, {Component} from 'react'
import { Modal, ModalBody } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import AppModalCollection from '../components/AppModalCollection'
import {allowedAttributes, allowedTags, number_per_page_by_db} from "../config"
import SanitizedHTML from 'react-sanitized-html'
import * as Lang from "../lang"
import ReactPaginate from 'react-paginate'

export default class AppModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            showModal2: false,
            coll: ""
        };
        //this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.setState({
            //showModal:
        })
    }

    openModal(coll) {
        this.setState({
            showModal2: true,
            coll: coll
        });
    };

    setModalShow = (e) => {
        this.setState({
            showModal2: e
        })
    };

    toggle = () => {
        this.props.params.setModal(!this.state.modal);
        this.setState({
            modal: !this.state.modal
        });
    };

    close = () => {
        this.props.params.setModal(false);
        this.setState({
            modal: false
        });
    };

    formatDate = (date) => {
        if (date !== undefined && date !== null) {
            const tmp_date = date !== null && new Date(date);
            const tmp_day = tmp_date.getDate();
            const tmp_month = tmp_date.getMonth() + 1;
            const tmp_year = tmp_date.getFullYear();
            return tmp_day + ".\u00A0" + tmp_month + ".\u00A0" + tmp_year + ".";
        }
        else {
            return "";
        }
    };

    formatDates = (dates) => {
        if (dates !== undefined && dates !== null) {
            //let tmp_array = dates.split(" ");
            return this.formatDate(dates.gte) + " - " + this.formatDate(dates.lte);
        }
        else {
            return "";
        }
    };

    formatDateTime = (time) => {
        if (time !== undefined && time !== null) {
            const tmp_date = time !== null && new Date(time);
            const tmp_day = tmp_date.getDate();
            const tmp_month = tmp_date.getMonth() + 1;
            const tmp_year = tmp_date.getFullYear();
            const tmp_hour = tmp_date.getHours();
            const tmp_minute = tmp_date.getMinutes();
            const tmp_second = tmp_date.getSeconds();
            //const tmp = tmp_date.toString().split("(")[0].toString().split(" ");
            //const timeZone = tmp[tmp.length - 2];
            return tmp_day + ". " + tmp_month + ". " + tmp_year + ". " + tmp_hour + ":" + tmp_minute + ":" + tmp_second /*+ " (" + timeZone + ")"*/;
        }
        else {
            return "";
        }
    };

    formatDateTimes = (times) => {
        if (times !== undefined && times !== null) {
            //let tmp_array = times.split(" ");
            return this.formatDateTime(times.gte) + " - " + this.formatDateTime(times.lte);
        }
        else {
            return "";
        }
    };

    render() {
        let prev = <FontAwesomeIcon icon={"chevron-left"}/>;
        let next = <FontAwesomeIcon icon={"chevron-right"}/>;
        let total = 0;
        if(this.props.params.total !== undefined) total = this.props.params.total.results;
        if(this.props.params.total > 100000) {
            total = 100000;
        }
        return (
            <div>
                <Modal size="lg" isOpen={this.state.modal} onClosed={() => this.close()} toggle={this.toggle} className={this.props.className}>
                    {/*<ModalHeader toggle={this.toggle}>Log atributa</ModalHeader>*/}
                    <div className="modal-header">
                        <h5 className="modal-title">{Lang.ATTR_HISTORY}</h5>
                        <button type="button" className="close myClose" onClick={this.toggle} aria-label="Close"> <span>{Lang.CLOSE}</span> <i className="fa fa-times"></i> </button>
                    </div>
                    <ModalBody>
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        {Lang.DATE}
                                    </th>
                                    <th>
                                        {Lang.COLLECTION}
                                    </th>
                                    <th>
                                        {Lang.OLD_VALUE}
                                    </th>
                                    {this.props.params.params[0] !== null &&
                                        <th>
                                            {Lang.DURATION}
                                        </th>
                                    }
                                    <th>
                                        {Lang.NEW_VALUE}
                                    </th>
                                    {this.props.params.params[0] !== null &&
                                        <th>
                                            {Lang.DURATION}
                                        </th>
                                    }
                                </tr>
                                {this.props.params.results.results !== undefined && this.props.params.results.results.map((item, index) => {
                                    const tmp_date = item.created_at !== null && new Date(item.created_at);
                                    const date_created = tmp_date.getDate() + "." + (tmp_date.getMonth()+1) + "." + tmp_date.getFullYear();
                                    if(item.attribute !== undefined && item.attribute.attribute_type.data_type !== undefined) { //Log atributa
                                        let old_value = item.old_value;
                                        let new_value = item.new_value;
                                        if(old_value !== null && old_value.id !== undefined) {
                                            old_value = old_value.value
                                        }
                                        if(new_value !== null && new_value.id !== undefined) {
                                            new_value = new_value.value
                                        }
                                        if(item.attribute.attribute_type.data_type.string_id === "date") {
                                            old_value = (item.old_value !== null) ? this.formatDate(old_value) : "\u00A0/\u00A0";
                                            new_value = this.formatDate(new_value);
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "boolean") {
                                            if(item.old_value !== null) {
                                                if(item.old_value) {
                                                    old_value = Lang.YES
                                                }
                                                else {
                                                    old_value = Lang.NO
                                                }
                                            }
                                            else {
                                                old_value = "\u00A0/\u00A0"
                                            }
                                            if(item.new_value) {
                                                new_value = Lang.YES
                                            }
                                            else {
                                                new_value= Lang.NO
                                            }
                                        }
                                        if(item.attribute.attribute_type.data_type.string_id === "range_date") {
                                            old_value = (item.old_value !== null && (item.old_value.gte !== null || item.old_value.lte !== null)) ? this.formatDates(old_value) : "\u00A0/\u00A0";
                                            new_value = this.formatDates(new_value);
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "datetime") {
                                            old_value = (item.old_value !== null && (item.old_value.gte !== null || item.old_value.lte !== null)) ? this.formatDateTime(old_value) : "\u00A0/\u00A0";
                                            new_value = this.formatDateTime(new_value);
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "range_datetime") {
                                            old_value = (item.old_value !== null && (item.old_value.gte !== null || item.old_value.lte !== null)) ? this.formatDateTimes(old_value) : "\u00A0/\u00A0";
                                            new_value = this.formatDateTimes(new_value);
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "fixed_point" || item.attribute.attribute_type.data_type.string_id === "int" || item.attribute.attribute_type.data_type.string_id === "floating_point") {
                                            if(item.old_value !== null) {
                                                if(item.old_currency !== undefined && item.old_currency !== null && item.old_currency.sign !== undefined  && item.old_currency.sign !== null ) {
                                                    if(item.old_currency.sign_before_value) {
                                                        old_value = item.old_currency.sign + old_value.toLocaleString('de-DE', {minimumFractionDigits: 2})
                                                    }
                                                    else {
                                                        old_value = old_value.toLocaleString('de-DE', {minimumFractionDigits: 2}) + item.old_currency.sign;
                                                    }
                                                }
                                                else if(item.attribute.attribute_type.data_type.string_id === "int") {
                                                    old_value.toLocaleString('de-DE', {minimumFractionDigits: 0})
                                                }
                                                else {
                                                    old_value.toLocaleString('de-DE', {minimumFractionDigits: 2})
                                                }                                                
                                            }
                                            else {
                                                old_value = "\u00A0/\u00A0";
                                            }
                                            if(item.new_currency !== undefined && item.new_currency !== null && item.new_currency.sign !== undefined  && item.new_currency.sign !== null ) {
                                                if(item.new_currency.sign_before_value) {
                                                    new_value = item.new_currency.sign + new_value.toLocaleString('de-DE', {minimumFractionDigits: 2})
                                                }
                                                else {
                                                    new_value = new_value.toLocaleString('de-DE', {minimumFractionDigits: 2}) + item.new_currency.sign;
                                                }
                                            }
                                            else if(item.attribute.attribute_type.data_type.string_id === "int") {
                                                new_value.toLocaleString('de-DE', {minimumFractionDigits: 0})
                                            }
                                            else {
                                                new_value = new_value.toLocaleString('de-DE', {minimumFractionDigits: 2})
                                            }
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "text") {
                                            if(old_value !== null) {
                                                old_value = <div /*dangerouslySetInnerHTML={{__html: old_value}}*/>
                                                    <SanitizedHTML html={old_value} allowedTags={allowedTags}
                                                                   allowedAttributes={allowedAttributes}/>
                                                </div>;
                                            }
                                            else {
                                                old_value = "\u00A0/\u00A0";
                                            }
                                            new_value = <div /*dangerouslySetInnerHTML={{__html: new_value}}*/>
                                                            <SanitizedHTML html={new_value} allowedTags={allowedTags} allowedAttributes={allowedAttributes} /></div>;
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "range_fixed_point" || item.attribute.attribute_type.data_type.string_id === "range_int" || item.attribute.attribute_type.data_type.string_id === "range_floating_point") {
                                            if(item.old_value !== null && (item.old_value.gte !== null || item.old_value.lte !== null)) {
                                                //let tmp_array = item.old_value.split(" ");
                                                //let tmp_from = tmp_array[0].replace("null", "");
                                                let tmp_from = item.old_value.gte;
                                                //let tmp_to = tmp_array[2].replace("null", "");
                                                let tmp_to = item.old_value.lte;
                                                if(item.old_currency !== undefined && item.old_currency !== null && item.old_currency.sign !== undefined && item.old_currency.sign !== null) {
                                                    if(item.old_currency.sign_before_value) {
                                                        tmp_from = item.old_currency.sign + Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 2});
                                                        tmp_to = item.old_currency.sign + Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 2});
                                                    }
                                                    else {
                                                        tmp_from = Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 2}) + item.old_currency.sign;
                                                        tmp_to = Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 2}) + item.old_currency.sign;
                                                    }
                                                }
                                                else if(item.attribute.attribute_type.data_type.string_id === "range_int") {
                                                    tmp_from = Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 0})
                                                    tmp_to = Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 0})
                                                }
                                                else {
                                                    tmp_from = Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 2})
                                                    tmp_to = Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 2})
                                                }
                                                old_value = tmp_from + " - " + tmp_to;
                                            }
                                            else {
                                                old_value = "\u00A0/\u00A0"
                                            }
                                            if(item.new_value !== null && (item.new_value.gte !== null || item.new_value.lte !== null)) {
                                                //let tmp_array = item.new_value.split(" ");
                                                //let tmp_from = tmp_array[0].replace("null", "");
                                                let tmp_from = item.new_value.gte;
                                                //let tmp_to = tmp_array[2].replace("null", "");
                                                let tmp_to = item.new_value.lte;
                                                if(item.new_currency !== undefined && item.new_currency !== null && item.new_currency.sign !== undefined && item.new_currency.sign !== null) {
                                                    if(item.new_currency.sign_before_value) {
                                                        tmp_from = item.new_currency.sign + Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 2});
                                                        tmp_to = item.new_currency.sign + Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 2});
                                                    }
                                                    else {
                                                        tmp_from = Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 2}) + item.new_currency.sign;
                                                        tmp_to = Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 2}) + item.new_currency.sign;
                                                    }
                                                }
                                                else if(item.attribute.attribute_type.data_type.string_id === "range_int") {
                                                    tmp_from = Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 0});
                                                    tmp_to = Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 0});
                                                }
                                                else {
                                                    tmp_from = Number(tmp_from).toLocaleString('de-DE', {minimumFractionDigits: 2});
                                                    tmp_to = Number(tmp_to).toLocaleString('de-DE', {minimumFractionDigits: 2});
                                                }
                                                new_value = tmp_from + " - " + tmp_to;
                                            }
                                            else {
                                                new_value = "\u00A0/\u00A0"
                                            }
                                        }
                                        else if(item.attribute.attribute_type.data_type.string_id === "geo") {
                                            if(item.old_value !== null) {
                                                let lon = item.old_value.lon !== null ? Number(item.old_value.lon).toLocaleString('de-DE', {minimumFractionDigits: 2}) : "";
                                                let lat = item.old_value.lat !== null ? Number(item.old_value.lat).toLocaleString('de-DE', {minimumFractionDigits: 2}) : "";
                                                old_value = lon + ", " + lat;
                                            }
                                            else {
                                                old_value = "\u00A0/\u00A0";
                                            }
                                            if(item.new_value.lon !== null || item.new_value.lat !== null) {
                                                let lon = item.new_value.lon !== null ? Number(item.new_value.lon).toLocaleString('de-DE', {minimumFractionDigits: 2}) : "";
                                                let lat = item.new_value.lat !== null ? Number(item.new_value.lat).toLocaleString('de-DE', {minimumFractionDigits: 2}) : "";
                                                new_value = lat + ", " + lon;
                                            }
                                            else {
                                                new_value = "\u00A0/\u00A0";
                                            }
                                        }
                                        else {
                                            old_value = (item.old_value !== null) ? old_value : "\u00A0/\u00A0";
                                            //new_value = new_value;
                                        }
                                        //lat, lon
                                        //gte, lte

                                        return <tr key={index}>
                                            <td>
                                                {date_created}
                                            </td>
                                            <td>
                                                <span className="AppModal-Button-Link" onClick={() => this.openModal(item.collection)} >
                                                    {item.collection.name}
                                                </span>
                                            </td>
                                            <td>
                                                {old_value}
                                            </td>
                                            <td>
                                                {this.formatDate(item.old_valid_from)} {(item.old_valid_from !== null || item.old_valid_to !== null) ? "-" : "\u00A0/\u00A0"} {this.formatDate(item.old_valid_to)}
                                            </td>
                                            <td>
                                                {new_value}
                                            </td>
                                            <td>
                                                {this.formatDate(item.new_valid_from)} {(item.new_valid_from !== null || item.new_valid_to !== null) ? "-" : "\u00A0/\u00A0"} {this.formatDate(item.new_valid_to)}
                                            </td>
                                        </tr>
                                    }
                                    else { //Detalji zapisa za Connection
                                        return <tr key={index}>
                                            <td>
                                                {date_created}
                                            </td>
                                            <td>
                                                <span className="AppModal-Button-Link" onClick={() => this.openModal(item.collection)} >
                                                    {item.collection.name}
                                                </span>
                                            </td>
                                            <td>
                                                {this.formatDate(item.old_valid_from)} {(item.old_valid_from !== null || item.old_valid_to !== null) ? "-" : "\u00A0/\u00A0"} {this.formatDate(item.old_valid_to)}
                                            </td>
                                            <td>
                                                {this.formatDate(item.new_valid_from)} {(item.new_valid_from !== null || item.new_valid_to !== null) ? "-" : "\u00A0/\u00A0"} {this.formatDate(item.new_valid_to)}
                                            </td>
                                        </tr>
                                    }
                                })}
                            </tbody>
                        </table>
                        {total !== undefined && total > number_per_page_by_db && <div style={{display: Math.ceil(total / number_per_page_by_db) < 2 ? 'none' : null}} className={"Pagination-small"}>
                            <ReactPaginate
                                previousLabel={prev}
                                nextLabel={next}
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
                            <div className={"Paginatation-more-div"}>{(this.props.params.total !== undefined && this.props.params.total.results !== undefined && this.props.params.total.results > 100000)
                                ? Lang.MORE + ". " + Lang.TOTAL + this.props.params.total !== undefined && this.props.params.total.results !== undefined && this.props.params.total.results + " " + Lang.DATA_PLURAL
                                : ""}
                            </div>
                        </div>}
                    </ModalBody>
                </Modal>
                {this.state.showModal2 ? <AppModalCollection params={this.state.coll} setModal={this.setModalShow} /> : null}
            </div>
        );
    }
}
