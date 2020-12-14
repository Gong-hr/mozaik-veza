import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import ConnectionLogAttrData from '../containers/connectionLogAttrData'
import { Button } from 'reactstrap'
import {allowedAttributes, allowedTags, default_url} from "../config"
import SanitizedHTML from 'react-sanitized-html'
import * as Lang from "../lang"


export default class ConnectionAttributes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            attrId: null
        };
    }
    formatDate(date) {
        let tmp_date =  new Date(date);
        let tmp_day = tmp_date.getDate();
        let tmp_month = tmp_date.getMonth()+1;
        let tmp_year = tmp_date.getFullYear();
        return tmp_day + ". " + tmp_month + ". " + tmp_year + ".";
    }
    formatDateTime(time) {
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
    formatValue(value) {
        let string = "";
        if (value.attribute_type.data_type.string_id === "date") {
            string += this.formatDate(value.value) + ", "
        } else if (value.attribute_type.data_type.string_id === "range_date") {
            string += this.formatDate(value.value.gte) + " - " + this.formatDate(value.value.lte) + ", "
        } else if (value.attribute_type.data_type.string_id === "datetime") {
            string += this.formatDateTime(value.value) + ", "
        } else if (value.attribute_type.data_type.string_id === "range_datetime") {
            string += this.formatDateTime(value.value.gte) + " - " + this.formatDateTime(value.value.lte) + ", "
        } else if (value.attribute_type.data_type.string_id === "fixed_point" || value.attribute_type.data_type.string_id === "floating_point") {
            let tmp_string = "";
            if (value.currency !== undefined && value.currency !== null && value.currency.sign !== undefined && value.currency.sign !== null && value.currency.sign_before_value) {
                tmp_string += value.currency.sign;
            }
            tmp_string += value.value.toLocaleString('de-DE', {minimumFractionDigits: 2});
            if (value.currency !== undefined && value.currency !== null && value.currency.sign !== undefined && value.currency.sign !== null && !value.currency.sign_before_value) {
                tmp_string += value.currency.sign;
            }
            string += tmp_string + ", "
        } else if (value.attribute_type.data_type.string_id === "range_fixed_point" || value.attribute_type.data_type.string_id === "range_int" || value.attribute_type.data_type.string_id === "range_floating_point") {
            let tmp_from = value.value.gte.toLocaleString('de-DE', {minimumFractionDigits: 2});
            let tmp_to = value.value.lte.toLocaleString('de-DE', {minimumFractionDigits: 2});
            if (value.currency !== undefined && value.currency.sign !== undefined && value.currency.sign !== null) {
                if (value.currency.sign_before_value) {
                    tmp_from = value.currency.sign + tmp_from;
                    tmp_to = value.currency.sign + tmp_to;
                } else {
                    tmp_from = tmp_from + value.new_currency.sign;
                    tmp_to = tmp_to + value.new_currency.sign;
                }
            }

            string += tmp_from + " - " + tmp_to + ", "
        } else if (value.attribute_type.data_type.string_id === "boolean") {
            string += value.value ? "da, " : "ne, "
        } else {
            string += value.value + ", ";
        }
        let str = string.slice(0, -2);
        if (value.attribute_type.data_type.string_id === "text") {
            str = <div /*dangerouslySetInnerHTML={{__html: str}}*/>
                <SanitizedHTML html={str} allowedTags={allowedTags} allowedAttributes={allowedAttributes}/></div>;
        }
        return <span>{str}&nbsp;<Button className="font-awesome-holder"
                                        onClick={() => this.openModal(value.string_id)}><FontAwesomeIcon
            icon={"external-link-alt"}/></Button></span>
    }

    renderAttributeValue(item) {
        let attribute = "";
        if(item.attribute_type.data_type.string_id === "complex" && item.attributes !== undefined) {
             attribute = item.attributes.map((attr, i ) => {
                return <div key={i} >
                    <div className="Connection-ConnectionInfo-div" style={{marginLeft: "32px"}}>
                        <div className="bullet-dash"></div>
                        <span>{attr.name}: </span>
                        {this.renderAttributeValue(attr)}
                    </div>
                </div>
            });
        }
        else if( item.value !==undefined /*&& item.value.length > 0*/) {
            attribute = <span>
                    {this.formatValue(item)}
                </span>
        }
        return attribute;
    }
    openModal(id) {
        this.setState({
            showModal: true,
            attrId: id
        })
    };
    setModalShow = (e) => {
        this.setState({
            showModal: e
        })
    };
    render() {
        if (this.props.params.result === undefined && this.props.params.result === null) {
            return ("");
        }
        else if(this.props.params.result !== undefined && this.props.params.result.entity_b !== null){
            //id = this.props.params.result.entity_b.public_id;
        }
        let iconType = "grey";
        let validFromTo = "";
        let transactionDate = "";
        let transactionAmount = "";
        let attributes = [];
        let show_attribute = true;//false;
        let entity_a_type = "building";
        let entity_a_type_name = Lang.LEGAL_ENTITY;
        let entity_b_type = "building";
        let entity_b_type_name = Lang.LEGAL_ENTITY;
        if (this.props.params.result !== undefined && this.props.params.result.entity_a !== undefined && this.props.params.result.entity_a !== null) {
            if(this.props.params.result.entity_a.entity_type.string_id === "person") {
                entity_a_type = "male";
                entity_a_type_name = Lang.PERSON;
            }
            else if (this.props.params.result.entity_a.entity_type.string_id === "real_estate") {
                entity_a_type = "home";
                entity_a_type_name = Lang.REALESTATE;
            }
            else if (this.props.params.result.entity_a.entity_type.string_id === "movable") {
                entity_a_type = "car";
                entity_a_type_name = Lang.MOVABLE;
            }
            else if (this.props.params.result.entity_a.entity_type.string_id === "savings") {
                entity_a_type = "piggy-bank";
                entity_a_type_name = Lang.SAVINGS;
            }
        }
        if (this.props.params.result !== undefined && this.props.params.result.entity_b !== undefined && this.props.params.result.entity_b !== null) {
            if(this.props.params.result.entity_b.entity_type.string_id === "person") {
                entity_b_type = "male";
                entity_b_type_name = Lang.PERSON;
            }
            else if (this.props.params.result.entity_b.entity_type.string_id === "real_estate") {
                entity_b_type = "home";
                entity_b_type_name = Lang.REALESTATE;
            }
            else if (this.props.params.result.entity_b.entity_type.string_id === "movable") {
                entity_b_type = "car";
                entity_b_type_name = Lang.MOVABLE;
            }
            else if (this.props.params.result.entity_b.entity_type.string_id === "savings") {
                entity_b_type = "piggy-bank";
                entity_b_type_name = Lang.SAVINGS;
            }
        }
        if(this.props.params.result !== undefined && this.props.params.result.connection_type_category !== undefined) {
            iconType = this.props.params.result.connection_type_category.string_id.substring(0, 3);
            let valid_from = "";
            let valid_to = "";
            if(this.props.params.result.valid_from !== null) {
                valid_from = this.formatDate(this.props.params.result.valid_from);
            }
            valid_from += " - ";
            if(this.props.params.result.valid_to !== null ) {
                valid_to = <div style={{display: "inline"}}>
                    <span>{this.formatDate(this.props.params.result.valid_to)}</span>
                    <Button className="font-awesome-holder" onClick={() => this.openModal("valid_to")} style={{display: "none"}}><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                </div>;
            }
            validFromTo =
                ((this.props.params.result.valid_from !== undefined && this.props.params.result.valid_from !== null)
                    || (this.props.params.result.valid_to !== undefined && this.props.params.result.valid_to !== null)) ? <div>
                    <div className="Connection-ConnectionInfo-div">
                        <div className="bullet-dash"></div>
                        <span>{Lang.DURATION}: </span>
                        <span>{valid_from} </span>
                        <Button className="font-awesome-holder" onClick={() => this.openModal("valid_from")} style={{display: "none"}}><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                        {valid_to}
                    </div>
                </div> : "";
            transactionAmount =
                this.props.params.result.transaction_amount !== null ? <div>
                    <div className="Connection-ConnectionInfo-div">
                        <div className="bullet-dash"></div>
                        <span>{Lang.TRANSACTION_AMOUNT}: </span>
                        <span>
                            {this.props.params.result.transaction_amount.toLocaleString('de-DE', { minimumFractionDigits: 2})} {this.props.params.result.transaction_currency.sign !== null && this.props.params.result.transaction_currency.sign}
                        </span>
                        <Button className="font-awesome-holder" onClick={() => this.openModal("transaction_amount")} style={{display: "none"}}><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                    </div>
                </div> : "";
            let transaction_date = "";
            if(this.props.params.result.transaction_date !== null) {
                transaction_date = this.formatDate(this.props.params.result.transaction_date);
            }
            transactionDate =
                this.props.params.result.transaction_date !== undefined && this.props.params.result.transaction_date !== null ? <div>
                    <div className="Connection-ConnectionInfo-div">
                        <div className="bullet-dash"></div>
                        <span>{Lang.TRANSACTION_DATES}: </span>
                        <span>{transaction_date} </span>
                        <Button className="font-awesome-holder" onClick={() => this.openModal("transaction_date")} style={{display: "none"}}><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                    </div>
                </div> : "";

            if(this.props.params.result.attributes !== undefined && this.props.params.result.attributes.length > 0) {
                this.props.params.result.attributes.map((item, index) =>{
                    if(this.props.params.result[item.string_id] !== undefined) {
                    }
                    return null
                });
                attributes = this.props.params.result.attributes.map((item, index) => {
                    return  (this.props.params.result[item.string_id] !== undefined && show_attribute) &&
                        <div key={index} className="Connection-ConnectionInfo-div">
                            <div className="bullet-dash"></div>
                            <span>{item.name}: </span>
                            {this.renderAttributeValue(item) }
                        </div>
                    })
}
        }

        return(
            <div className={"Connection-attributes"}>
                <h1>
                    {this.props.params.result !== undefined && this.props.params.result.connection_type_category !== undefined && this.props.params.result.connection_type_category.name} {Lang.CONNECTION_SMALLCAPS}
                </h1>
                <Button className="Connection-left-column-subtitle Connection-left-column-subtitle-red" onClick={() => this.openModal(null, this.props.params.params.id)} >
                    <span className="font-awesome-holder"><FontAwesomeIcon icon={"eye"}/></span>
                    &nbsp;{Lang.DETAILS}
                </Button>
                <div className="Entity-left-column-subtitle Entity-left-column-subtitle-red">
                    <a href={default_url + "/search/connections/by-id/" + this.props.params.params.id + "/?format=json&full=true&as_file=true"} target={"_blank"}><span className={"font-awesome-button"}><FontAwesomeIcon icon={"download"}/></span></a>
                </div>
                <div className="row empty-row d-none d-md-block"></div>
                <div className="row empty-row d-none d-md-block"></div>
                <div className="row empty-row"></div>
                <div className="row empty-row"></div>
                <h2>
                    <Link to={'/entity/'+(this.props.params.result !== undefined && this.props.params.result.entity_a !== undefined && this.props.params.result.entity_a !== null && this.props.params.result.entity_a.public_id)}>
                        {this.props.params.result !== undefined &&

                        (this.props.params.result.entity_a !== undefined && this.props.params.result.entity_a !== null && this.props.params.result.entity_a.name.trim() !== "" ?
                                this.props.params.result.entity_a.name
                                : "...")
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
                    <div className={"image-div d-none d-sm-block"}>
                        <div className={"crta " + iconType.toUpperCase() + "background"}></div>
                        <div className={"krug " + iconType.toUpperCase() + "background"}></div>
                    </div>
                    <h2>
                        {this.props.params.result !== undefined && this.props.params.result.connection_type !== undefined && this.props.params.result.connection_type.name}
                        <abbr className={"connection-type-abbr " + iconType}
                              title={this.props.params.result !== undefined && this.props.params.result.connection_type !== undefined ? this.props.params.result.connection_type_category.name : ""}>
                            {iconType.toUpperCase()}
                        </abbr>
                    </h2>
                    {validFromTo}
                    {transactionAmount}
                    {transactionDate}
                    {attributes}
                </div>
                <h2>
                    <Link to={'/entity/'+(this.props.params.result !== undefined && this.props.params.result.entity_b !== undefined && this.props.params.result.entity_b !== null && this.props.params.result.entity_b.public_id)}>
                        {this.props.params.result !== undefined && this.props.params.result.entity_b !== undefined &&
                        (this.props.params.result.entity_b !== null && this.props.params.result.entity_b.name.trim() !== "" ?
                            this.props.params.result.entity_b.name
                            : "...")
                        }
                    </Link>
                </h2>
                <p>
                    <span>
                        <FontAwesomeIcon icon={entity_b_type}/>
                    </span>
                    {entity_b_type_name}
                </p>

                {this.state.showModal ? <ConnectionLogAttrData params={[this.state.attrId, this.props.params.params.id]} setModal={this.setModalShow} /> : null}
            </div>
        )

    }
}