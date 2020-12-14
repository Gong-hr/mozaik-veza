import React, {Component} from 'react'
import { Button,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators} from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import CircleDiv from '../components/CircleDiv'
import EntityLogAttrData from '../containers/entityLogAttrData'
import {XYPlot, VerticalBarSeries, XAxis, Hint } from 'react-vis'
import {store} from "../index"
import YesNoModal from './YesNoModal'
import {allowedAttributes, allowedTags, default_url} from "../config"
import SanitizedHTML from 'react-sanitized-html'
import * as Lang from "../lang"

export default class EntityAttributes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMoreAttributes: false,
            hoveredCell: {},
            dataForHoveredCell: "",
            showBars: false,
            activeIndex: 0,
            showModal: false,
            showModalYesNo: false,
            attrId: null,
            followed: this.props.params.result !== undefined ? this.props.params.result.followed : false,
        };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    items = [];
    years  = [];

    componentWillMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                followed: store.getState().rootReducer.reducer.followed
            })
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.params.params !== undefined && this.props.params.params !== undefined
            && prevProps.params.params.id !== this.props.params.params.id
            && (prevState.showMoreAttributes || prevState.showBars)
        ) {
            this.setState({
                showMoreAttributes: false,
                showBars: false
            });
        }
    }

    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    handleShowMoreAttributes () {
        this.setState({showMoreAttributes: true})
    }

    formatDate = (date) => {
        if (date !== undefined && date !== null) {
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

    isValidDate = (dateString) => {
        if (typeof dateString === "string") {
            let regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false;  // Invalid format
            let d = new Date(dateString);
            if (!d.getTime() && d.getTime() !== 0) return false; // Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        }
        return false;
    };

    formatValue = (item, isItEntityView) => {
        let value = "";
        if(item[3] === "complex") {
            item[1].map((subitem) => {
                    value = subitem !== undefined && subitem.map((subfield, index) => {
                        return (<div key={index}
                                     className={isItEntityView ? "Entity-left-column-info-div" : "Filter-Entity-right-details-div"}
                                     style={{paddingLeft: "48px"}}>
                            <div className="bullet-dash"></div>
                            <span> {subfield[2]}:&nbsp;</span>
                            <span>
                            { this.formatValue(subfield, subfield[1][0], isItEntityView) }
                        </span>
                            <Button className="font-awesome-holder" onClick={() => this.openModal(subfield[0])}
                                    style={ subfield[3] === "complex" || !isItEntityView ? {display: "none"} : {display: "inline-block"} }><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                        </div>)
                    });
                    return value;
            });
            return value;
        }
        else {
            item[1].map((field) => {
                if (item[3] === "date") {
                    value += this.isValidDate(field.value) ? this.formatDate(field.value) : field.value;
                    value += ", ";
                }
                else if (item[3] === "datetime") {
                    value += this.formatDateTime(field.value) + "; ";
                }
                else if (item[3] === "fixed_point" || item[3] === "floating_point") {
                    if(field.currency !== undefined && field.currency.sign !== undefined && field.currency.sign !== null && field.currency.sign_before_value) {
                        value += field.currency.sign;
                    }
                    value += field.value.toLocaleString('de-DE', {minimumFractionDigits: 2});
                    if(field.currency !== undefined && field.currency.sign !== undefined && field.currency.sign !== null && !field.currency.sign_before_value) {
                        value += field.currency.sign;
                    }
                    value += ", "
                }
                else if (item[3] === "boolean") {
                    value += field.value ? Lang.YES + ", " : Lang.NO + ", ";
                }
                else if (field.value !== undefined && (field.value.lat !== undefined || field.value.lon !== undefined)) {
                    let lat = "";
                    let lon = "";
                    field.value.lat !== undefined ? lat = field.value.lat.toString().replace(".", ",") : lat = "-";
                    field.value.lon !== undefined ? lon = field.value.lon.toString().replace(".", ",") : lon = "-";
                    value += lat + ", " + lon + "; ";
                }
                else if (field.value !== undefined && (field.value.gte !== undefined || field.value.lte)) {
                    let gte = "";
                    let lte = "";
                    if (item[3] === "range_date") {
                        field.value.gte !== undefined ? gte = this.formatDate(field.value.gte) : gte = "-";
                        field.value.lte !== undefined ? lte = this.formatDate(field.value.lte) : lte = "-";
                    }
                    else if (item[3] === "range_datetime") {
                        field.value.gte !== undefined ? gte = this.formatDateTime(field.value.gte) : gte = "-";
                        field.value.lte !== undefined ? lte = this.formatDateTime(field.value.lte) : lte = "-";
                    }
                    else if (item[3] === "range_fixed_point" || item[3] === "range_floating_point") {
                        if(field.value.gte !== undefined){
                            if(field.currency !== undefined && field.currency.sign !== undefined && field.currency.sign !== null && field.currency.sign_before_value) {
                                gte += field.currency.sign;
                            }
                            gte += field.value.gte.toLocaleString('de-DE', {minimumFractionDigits: 2});
                            if(field.currency !== undefined && field.currency.sign !== undefined && field.currency.sign !== null && !field.currency.sign_before_value) {
                                gte += field.currency.sign;
                            }
                        }
                        else{
                            gte = "-";
                        }
                        if(field.value.lte !== undefined){
                            if(field.currency !== undefined && field.currency.sign !== undefined && field.currency.sign !== null && field.currency.sign_before_value) {
                                lte += field.currency.sign;
                            }
                            lte += field.value.lte.toLocaleString('de-DE', {minimumFractionDigits: 2});
                            if(field.currency !== undefined && field.currency.sign !== undefined && field.currency.sign !== null && !field.currency.sign_before_value) {
                                lte += field.currency.sign;
                            }
                        }
                        else{
                            lte = "-";
                        }
                    }
                    else {
                        field.value.gte !== undefined ? gte = field.value.gte : gte = "-";
                        field.value.lte !== undefined ? lte = field.value.lte : lte = "-";
                    }
                    value += gte + " - " + lte + "; ";
                }
                else {
                    value += field.value + ", ";
                }
                return null;
            });
            value = value.slice(0, -2);
            if(item[3] === "text") {
                value = <div /*dangerouslySetInnerHTML={{__html: value}}*/>
                                        <SanitizedHTML html={value} allowedTags={allowedTags} allowedAttributes={allowedAttributes} /></div>;
            }
        }
        return value;
    };

    largestCount = () => {
        let largest = 0;
        if (this.props.params.result.count_imovinsko_pravna > 0 || this.props.params.result.count_poslovna >0 || this.props.params.result.count_politicka || this.props.params.result.count_obiteljska > 0 || this.props.params.result.count_interesna > 0) {
            largest = Math.max(this.props.params.result.count_imovinsko_pravna, this.props.params.result.count_poslovna, this.props.params.result.count_politicka, this.props.params.result.count_obiteljska, this.props.params.result.count_interesna);
        }
        return largest;
    };

    setModalShow = (e) => {
        this.setState({
            showModal: e
        })
    };

    openModal(id) {
        this.setState({
            showModal: true,
            attrId: id
        })
    };

    /*carousel*/
    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }
    /*end carousel*/

    findHoveredValue (array) { //for Hint
        let sum = 0;
        array.map((item) => {
            if (item.x === this.state.hoveredCell.x) {
                 sum += item.y
            }
            return null;
        });
        return sum

    }

    followThisEntity = () => {
        if(!this.props.params.result.followed) {
            this.props.params.setFollowEntity();
        }

    };

    setModalShowYesNo = (e) => {
        this.setState({
            showModalYesNo: e
        })
    };

    openModalYesNo(e) {
        this.setState({
            showModalYesNo: e
        })
    };

    render() {
        let years_imo = [];
        let years_pos = [];
        let years_pol = [];
        let years_obi = [];
        let years_int = [];
        let number_years = 0;
        let number_slides = 0;
        this.years = [];
        this.items = [];
        if(this.props.params.results !== undefined && this.props.params.results.results !== undefined && this.props.params.results.results !== null) {
            let tmp_years = Object.entries(this.props.params.results.results);
            tmp_years.map((item, index) => {
                if(item[1].total > 0) {
                    number_years++;
                    if(this.years.indexOf(item[0]) < 0){
                        this.years.push(item[0]);
                    }
                    return item[1].per_connection_type_category.map((conn, i) => {
                        years_imo.push({x: item[0], y: conn.key === "imovinsko_pravna" ? conn.doc_count : 0});
                        years_pos.push({x: item[0], y: conn.key === "poslovna" ? conn.doc_count : 0});
                        years_pol.push({x: item[0], y: conn.key === "politicka" ? conn.doc_count : 0});
                        years_obi.push({x: item[0], y: conn.key === "obiteljska" ? conn.doc_count : 0});
                        years_int.push({x: item[0], y: conn.key === "interesna" ? conn.doc_count : 0});
                        return null
                    })
                }
                else {
                    return null;
                }
            });
        }
        if(window.innerWidth > 767) {
            if(number_years%5 > 0) {
                number_slides = (number_years - number_years%5)/5 +1;
                let z;
                let tmp_string = "";
                for (z = 0; z < (5 - number_years%5); z++) {
                    if(this.years.indexOf(tmp_string) < 0){
                        this.years.push(tmp_string);
                    }
                    years_imo.push({x: tmp_string, y: 0, size: 10});
                    years_pos.push({x: tmp_string, y: 0, size: 10});
                    years_pol.push({x: tmp_string, y: 0, size: 10});
                    years_obi.push({x: tmp_string, y: 0, size: 10});
                    years_int.push({x: tmp_string, y: 0, size: 10});
                    tmp_string += "\u00A0";
                }
            }
            else {
                number_slides = number_years/5;
            }
        }
        else {
            if(number_years%2 > 0) {
                number_slides = (number_years - number_years%2)/2 +1;
                let z;
                let tmp_string = "";
                for (z = 0; z < (2 - number_years%2); z++) {
                    if(this.years.indexOf(tmp_string) < 0){
                        this.years.push(tmp_string);
                    }
                    years_imo.push({x: tmp_string, y: 0, size: 10});
                    years_pos.push({x: tmp_string, y: 0, size: 10});
                    years_pol.push({x: tmp_string, y: 0, size: 10});
                    years_obi.push({x: tmp_string, y: 0, size: 10});
                    years_int.push({x: tmp_string, y: 0, size: 10});
                    tmp_string += "\u00A0";
                }
            }
            else {
                number_slides = number_years/2;
            }
        }


        if(this.items.length === 0) {
            let j;
            for(j = 0; j < number_slides; j++) {
                this.items.push({
                    src: j,
                    altText: 'Slide'+j,
                    caption: ''+j
                })
            }
        }
        let entityAttributesAlwayShown = "";
        let entityAttributesHidden = "";
        let tmp_entityAttributes = [];
        //let realAttributesArray = [];
        let fisrtsPart_entityAttributes = [];
        let secondPart_entityAttributes = [];
        let numberOfRealAttributes = 0;
        let attributeNames = [];
        let entity;
        let isItEntityView = false;
        let isItFilterView = false;

        if (this.props.params.result !== undefined && this.props.params.attributes !== undefined) {
            isItEntityView = true;
            entity = this.props.params.result;
            attributeNames = this.props.params.attributes.results;
        }
        else if (this.props.params !== undefined && this.props.params.entityData !== undefined && this.props.params.entityAttributes !== undefined) {
            isItFilterView = true;
            entity = this.props.params.entityData.result;
            attributeNames = this.props.params.entityAttributes;
        }
        if(isItEntityView) {
            tmp_entityAttributes = Object.entries(this.props.params.result);
        }
        else if (isItFilterView) {
            tmp_entityAttributes = Object.entries(this.props.params.entityData.result);
        }
        let realAttributesArray = tmp_entityAttributes.filter((item) => {
            return ((!item[0].startsWith("count_"))
                && item[0] !== "person_first_name"
                && item[0] !== "person_last_name"
                && item[0] !== "legal_entity_name"
                && item[0] !== "legal_entity_entity_type"
                && item[0] !== "person_vat_number"
                && item[0] !== "real_estate_name"
                && item[0] !== "movable_name"
                && item[0] !== "savings_name"
                && item[0] !== "deleted"
                && item[0] !== "published"
                && item[0] !== "search"
                && item[0] !== "public_id"
                && item[0] !== "is_pep"
                && item[0] !== "entity_type"
            );
        });
        let realAttributesNames = realAttributesArray.map((item, index) => {
            let new_item1 = [];
            if(attributeNames!== undefined && attributeNames!== null && attributeNames.results !== undefined) {
                attributeNames = attributeNames.results;
            }
            attributeNames!== undefined && attributeNames!== null && attributeNames.map((attr, i) => {
                if(attr.string_id === item[0]) {
                    item[2] = attr.name;
                    item[3] = attr.attribute_type.data_type.string_id;
                    item[4] = attr.order_number;
                    if(attr.attribute_type.data_type.string_id === "complex") {
                        new_item1 = item[1].map((attribute) => {
                            let sub_attributes = Object.entries(attribute);
                            let new_sub_attributes = sub_attributes.map((sub_attribute) => {
                                let tmp0 = sub_attribute[0];
                                let tmp1 = sub_attribute[1];
                                let tmp2 = "";
                                let tmp3 = "";
                                let tmp4 = "";
                                let tmp5 = [];
                                attributeNames.map((temp) => {
                                    if (temp.attribute_type.data_type.string_id === "complex") {
                                        temp.attributes !== undefined && temp.attributes.map((tempAttr) => {//temp.attributes su podatributi
                                            if (tempAttr.string_id === tmp0) {
                                                tmp2 = tempAttr.name;
                                                tmp3 = tempAttr.attribute_type.data_type.string_id;
                                                tmp4 = tempAttr.order_number;
                                                tmp5 = tempAttr.attributes;
                                            }
                                            return null;
                                        });
                                    }
                                    return null;
                                });
                                if(tmp3 === "complex" && tmp1 !== undefined && tmp1[0] !== undefined) { //postoje podpodatrubuti
                                    let attributes = tmp1[0];
                                    if(!Array.isArray(tmp1[0])) {
                                        attributes = Object.entries(tmp1[0]);
                                    }

                                    let subsubattr = attributes.map((attr) => {
                                        let attrName = tmp5.find((item) => {
                                            if(item.string_id === attr[0]) {
                                                return item;
                                            }
                                            else{ return null}
                                        });
                                        if(attrName !== undefined && attrName.name !== undefined) {
                                            attr[2] = attrName.name;
                                            attr[3] = attrName.attribute_type.data_type.string_id;
                                            attr[4] = attrName.order_number;
                                        }
                                        return attr;
                                    });
                                    tmp1[0] = subsubattr;
                                }
                                sub_attribute[1] = tmp1;
                                sub_attribute[2] = tmp2;
                                sub_attribute[3] = tmp3;
                                sub_attribute[4] = tmp4;
                                return sub_attribute
                            });
                            return new_sub_attributes;
                        });
                        item[1] = new_item1;
                    }
                }
                return item;
            });
           return item;
        });
        realAttributesNames.sort(function (a, b) {
            return a[4] - b[4];
        });

        //if(isItEntityView) {
            fisrtsPart_entityAttributes = realAttributesNames.slice(0, 3);
            secondPart_entityAttributes = realAttributesNames.slice(3, realAttributesNames.length);
        /*}
        else if(isItFilterView) {
            fisrtsPart_entityAttributes = realAttributesNames;
            secondPart_entityAttributes = [];
        }*/
        numberOfRealAttributes = realAttributesNames.length;

        let person = false;
        let legal = false;
        let realEstate = false;
        let movable = false;
        let savings = false;
        let entityName = Lang.ENTITY;
        if(entity !== undefined && entity.entity_type !== undefined) {
            if(entity.entity_type.string_id === "person") {
                person = true;
                entityName = entity.entity_type.name;
            }
            else if(entity.entity_type.string_id === "legal_entity") {
                legal = true;
                entityName = entity.entity_type.name;
            }
            else if(entity.entity_type.string_id === "real_estate") {
                realEstate = true;
                entityName = entity.entity_type.name;
            }
            else if(entity.entity_type.string_id === "movable") {
                movable = true;
                entityName = entity.entity_type.name;
            }
            else if(entity.entity_type.string_id === "savings") {
                savings = true;
                entityName = entity.entity_type.name;
            }
        }
        entityAttributesAlwayShown = fisrtsPart_entityAttributes.map((item) => {
            return <div key={item[0]}>
                <div className={isItEntityView ? "Entity-left-column-info-div" : "Filter-Entity-right-details-div"}>
                    <div className="bullet-dash"></div>
                        <span> {item[2]}:&nbsp; </span>
                        <span>
                            {this.formatValue(item, isItEntityView)}
                        </span>
                    <span style={{color: "red"}}></span>
                        <Button className="font-awesome-holder" onClick={() => this.openModal(item[0])} style={(item[3] === "complex" || isItFilterView) ? {display: "none"} : {display: "inline-block"} }><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                </div>
            </div>});
        entityAttributesHidden = secondPart_entityAttributes !== undefined && secondPart_entityAttributes.map((item) => {
            return <div key={item[0]}>
                <div key={item[0]} className={"Entity-left-column-info-div"}>
                    <div className="bullet-dash"></div>
                        <span> {item[2]}:&nbsp; </span>
                        <span>
                            {this.formatValue(item, isItEntityView)}
                        </span>
                        <Button className="font-awesome-holder" onClick={() => this.openModal(item[0])} style={item[3] === "complex" || isItFilterView ? {display: "none"} : {display: "inline-block"} }><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                </div>
            </div>});

        var name = "";
        if(entity !== undefined && entity !== null) {
            name =<div>
                {
                    person ?
                        entity.person_first_name !== undefined ?
                            <div>
                                {entity.person_first_name.map((first_name, index) => {
                                    return <span key={index}>{first_name.value + " "}</span>
                                    })
                                }
                                <Button className="font-awesome-holder" onClick={() => this.openModal("person_first_name")} ><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                            </div>
                        : null
                    : ""
                }
                {
                    person ?
                        entity.person_last_name !== undefined ?
                            <div>
                                {entity.person_last_name.map((last_name, index) => {
                                    return <span key={index}>{last_name.value + " "}</span>

                                    })
                                }
                                <Button className="font-awesome-holder" onClick={() => this.openModal("person_last_name")} ><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                            </div>
                        :
                            entity.person_first_name === undefined ?
                                <span className={"no_name"}>...</span>
                                : ""
                    : ""
                }
                {
                    legal ?
                        entity.legal_entity_name !== undefined ?
                            <div>
                                {entity.legal_entity_name.map((name, index) => {
                                    return <span key={index}>{name.value + " "}</span>
                                    })
                                }
                                <Button className="font-awesome-holder" onClick={() => this.openModal("legal_entity_name")} ><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                            </div>
                        : <span className={"no_name"}>...</span>

                    : ""
                }
                {
                    realEstate ?
                        entity.real_estate_name !== undefined ?
                            <div>
                                {entity.real_estate_name.map((name, index) => {
                                    return <span key={index}>{name.value + " "}</span>
                                    })
                                }
                                <Button className="font-awesome-holder" onClick={() => this.openModal("real_estate_name")} ><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                            </div>
                        : <span className={"no_name"}>...</span>
                    : ""
                }
                {
                    movable ?
                        entity.movable_name !== undefined ?
                            <div>
                                {entity.movable_name.map((name, index) => {
                                    return <span key={index}>{name.value + " "}</span>
                                    })
                                }
                                <Button className="font-awesome-holder" onClick={() => this.openModal("movable_name")} ><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                            </div>
                        : <span className={"no_name"}>...</span>
                    : ""
                }
                {
                    savings ?
                        entity.savings_name !== undefined ?
                            <div>
                                {entity.savings_name.map((name, index) => {
                                    return <span key={index}>{name.value + " "}</span>
                                })
                                }
                                <Button className="font-awesome-holder" onClick={() => this.openModal("savings_name")} ><FontAwesomeIcon icon={"external-link-alt"}/></Button>
                            </div>
                            : <span className={"no_name"}>...</span>
                        : ""
                }
            </div> ;
        }
        var is_pep = false;
        if(entity !== undefined && entity !== null && entity.is_pep) {
            is_pep = true;
        }
        const { showBars, activeIndex/*, hoveredCell, dataForHoveredCell*/ } = this.state;
        const icon = <FontAwesomeIcon icon={"download"}/>;
        let slides = [];
        let i;
        let k = 0;
        for (i = 0; i < this.years.length; i++){
            if(window.innerWidth > 767) {
                k = 5;
            }
            else {
                k = 2;
            }
            if(i%k === 0) {
                let tmpYears = this.years.slice(i, i + k);
                let tmpY_imo = years_imo.filter((item, index)=>{
                    if(tmpYears.indexOf(item.x) > -1){
                        return item
                    }
                    else { return null }
                });
                let tmpY_pos = years_pos.filter((item, index)=>{
                    if(tmpYears.indexOf(item.x) > -1){
                        return item
                    }
                    else { return null }
                });
                let tmpY_pol = years_pol.filter((item, index)=>{
                    if(tmpYears.indexOf(item.x) > -1){
                        return item
                    }
                    else { return null }
                });
                let tmpY_obi = years_obi.filter((item, index)=>{
                    if(tmpYears.indexOf(item.x) > -1){
                        return item
                    }
                    else { return null }
                });
                let tmpY_int = years_int.filter((item, index)=>{
                    if(tmpYears.indexOf(item.x) > -1){
                        return item
                    }
                    else { return null }
                });
                let carouselItem = <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={i}
                >
                    <XYPlot
                        height={window.innerWidth < 1400 ? window.innerWidth < 768 ? 180 : 200 : 240}
                        width={window.innerWidth < 1400 ? window.innerWidth < 768 ? 220 : 420 : 660}
                        xType="ordinal"
                        stackBy="y"
                        style={{marginTop: "6px"}}
                        tooltip = {true}
                    >
                        <XAxis/>
                        <VerticalBarSeries
                            onValueMouseOver={v => this.state.hoveredCell.x !== v.x !== v && this.setState({hoveredCell: v.x && v.y ? v : {}, dataForHoveredCell:  Lang.PROPERTY_SMALLCAPS})}
                            onValueMouseOut={v => this.setState({hoveredCell: {}})}
                            color="#ff5b3c"
                            data={tmpY_imo}>
                        </VerticalBarSeries>
                        <VerticalBarSeries
                            onValueMouseOver={v => this.state.hoveredCell.x !== v.x !== v && this.setState({hoveredCell: v.x && v.y ? v : {}, dataForHoveredCell: Lang.BUSINESS_SMALLCAPS})}
                            onValueMouseOut={v => this.setState({hoveredCell: {}})}
                            color="#9f6eff"
                            data={tmpY_pos}>
                        </VerticalBarSeries>
                        <VerticalBarSeries
                            onValueMouseOver={v => this.state.hoveredCell.x !== v.x !== v && this.setState({hoveredCell: v.x && v.y ? v : {}, dataForHoveredCell: Lang.POLITICAL_SMALLCAPS})}
                            onValueMouseOut={v => this.setState({hoveredCell: {}})}
                            color="#3cadff"
                            data={tmpY_pol}>
                        </VerticalBarSeries>
                        <VerticalBarSeries
                            onValueMouseOver={v => this.state.hoveredCell.x !== v.x !== v && this.setState({hoveredCell: v.x && v.y ? v : {}, dataForHoveredCell: Lang.FAMILY_SMALLCAPS})}
                            onValueMouseOut={v => this.setState({hoveredCell: {}})}
                            color="#2be84e"
                            data={tmpY_obi}>
                        </VerticalBarSeries>
                        <VerticalBarSeries
                            onValueMouseOver={v => this.state.hoveredCell.x !== v.x && this.setState({hoveredCell: v.x && v.y ? v : {}, dataForHoveredCell: Lang.INTEREST_SMALLCAPS})}
                            onValueMouseOut={v => this.setState({hoveredCell: {}})}
                            color="#ffeb30"
                            data={tmpY_int}>
                        </VerticalBarSeries>
                        {this.state.hoveredCell.y !== undefined ?
                            <Hint value={this.state.hoveredCell} align={{vertical: 'top'}} >
                                <div style={{ backgroundColor: 'white', borderRadius: "4px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"}}>
                                    <p style={{
                                        paddingLeft: "4px",
                                        paddingRight: "4px",
                                        lineHeight: "1.5", fontFamily: 'Barlow'}}>&nbsp;{this.state.dataForHoveredCell}
                                        <b>&nbsp;&nbsp;{(this.state.dataForHoveredCell === Lang.PROPERTY_SMALLCAPS && this.findHoveredValue(tmpY_imo) !== undefined && this.findHoveredValue(tmpY_imo) > 0) ? this.findHoveredValue(tmpY_imo) : ""}
                                        {(this.state.dataForHoveredCell === Lang.BUSINESS_SMALLCAPS && this.findHoveredValue(tmpY_pos) !== undefined && this.findHoveredValue(tmpY_pos) > 0) ? this.findHoveredValue(tmpY_pos) : ""}
                                        {(this.state.dataForHoveredCell === Lang.POLITICAL_SMALLCAPS && this.findHoveredValue(tmpY_pol) !== undefined && this.findHoveredValue(tmpY_pol) > 0) ? this.findHoveredValue(tmpY_pol) : ""}
                                        {(this.state.dataForHoveredCell === Lang.FAMILY_SMALLCAPS && this.findHoveredValue(tmpY_obi) !== undefined && this.findHoveredValue(tmpY_obi) > 0) ? this.findHoveredValue(tmpY_obi) : ""}
                                        {(this.state.dataForHoveredCell === Lang.INTEREST_SMALLCAPS && this.findHoveredValue(tmpY_int) !== undefined && this.findHoveredValue(tmpY_int) > 0) ? this.findHoveredValue(tmpY_int) : ""}&nbsp;</b>
                                    </p>
                                </div>
                            </Hint>
                            : null}
                    </XYPlot>
                </CarouselItem>;
                slides.push(carouselItem);
            }
        }
        return (
            <div>
                <h1 className={"entityName"} style={{display: isItEntityView ? "block" : "none"}}>{name}</h1>
                <div className="Entity-left-column-subtitle" style={{textAlign: isItFilterView ? "left" : "center"}}>
                    <span className={isItFilterView ? "font-awesome-holder filterView" : "font-awesome-holder"}>
                        <FontAwesomeIcon icon={person ? "male" : realEstate ? "home" : movable ? "car" : savings ? "piggy-bank" : "building"} style={{color: is_pep ? "#f6da00" : ""}}/>
                    </span>
                    <span>
                        {person
                            ?
                            entityName === "Person" ? Lang.PERSON : entityName
                            :
                            entityName === "Legal Entity" ? Lang.LEGAL_ENTITY : entityName}
                        </span>
                </div>
                {
                    this.props.params.result !== undefined && this.state.followed ?
                        <Button className="Entity-left-column-subtitle Entity-left-column-subtitle-red" onClick={()=>this.openModalYesNo(this.props.params.params.id)} style={{display: this.props.params.loggedIn !== undefined && this.props.params.loggedIn.activeUser !== undefined && this.props.params.loggedIn.activeUser.token !== undefined ? "inline-block" : "none"}}>
                            <span className={"font-awesome-holder star-sunflower"}  style={{display: this.props.params.loggedIn !== undefined && this.props.params.loggedIn.activeUser !== undefined && this.props.params.loggedIn.activeUser.token !== undefined ? "inline" : "none"}}><FontAwesomeIcon icon={"star"}/></span>
                            &nbsp;{Lang.STOP_FOLLOWING_ENTITY}
                        </Button>
                    :
                        <Button className="Entity-left-column-subtitle Entity-left-column-subtitle-red" onClick={()=>this.followThisEntity()} style={{display: this.props.params.loggedIn !== undefined && this.props.params.loggedIn.activeUser !== undefined && this.props.params.loggedIn.activeUser.token !== undefined ? "inline-block" : "none"}}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"star"}/></span>
                            &nbsp;{Lang.FOLLOW_ENTITY}
                        </Button>
                }
                <div className="Entity-left-column-subtitle Entity-left-column-subtitle-red">
                    {this.props.params.params !== undefined && this.props.params.params.id !== undefined && this.props.params.params.id !==null &&
                        <a href={default_url + "/search/entities/by-public_id/" + this.props.params.params.id + "/?format=json&full=true&as_file=true"} target={"_blank"}>
                            <span className={"font-awesome-button"}>{icon}</span>
                        </a>
                    }
                </div>
                {(isItEntityView && numberOfRealAttributes > 0) && <h2>{Lang.INFO}</h2>}
                {entityAttributesAlwayShown}
                <div className={"moreAttributes"}>
                    {this.state.showMoreAttributes && entityAttributesHidden !== undefined && entityAttributesHidden.length > 0 ? entityAttributesHidden : null }
                </div>
                <div className="Entity-left-column-info-more-div" style={(this.state.showMoreAttributes || numberOfRealAttributes<4 /*|| isItFilterView*/) ? {display: "none"} : {display: "block"}}>
                    <Button onClick={() => this.handleShowMoreAttributes()}>
                        {Lang.SHOW_MORE} &nbsp;
                        {numberOfRealAttributes>3 ? numberOfRealAttributes-3 : ""} &nbsp;
                        {(numberOfRealAttributes-3) === 1 || (numberOfRealAttributes % 10) === 1 ? Lang.DATA :
                            ((numberOfRealAttributes-3) === 2 || (numberOfRealAttributes-3) === 3 || (numberOfRealAttributes-3) === 4 || (numberOfRealAttributes > 20 && (numberOfRealAttributes % 10 === 2 || numberOfRealAttributes % 10 === 3 || numberOfRealAttributes % 10 === 4)) ? Lang.DATA_DUAL
                                : Lang.DATA_PLURAL )}
                        <span className="font-awesome-holder"><FontAwesomeIcon icon={"ellipsis-h"}/></span>
                     </Button>
                </div>

                {entity !== undefined && isItEntityView ?
                    <div className="Entity-left-column-connection-circles">
                        <div className={"Entity-left-column-connection-circles-buttons"}>
                            <button onClick={() => this.setState({showBars: false})} className={showBars ? "" : "active"}>
                                <span className={""}>{Lang.RATIO}</span>
                            </button>
                            <button onClick={() => this.setState({showBars: true})} className={showBars ? "showBars active" : "showBars"}>
                                <span className={""}>{Lang.YEARS}</span>
                            </button>
                        </div>
                        <div className={showBars ? "d-none" : "d-none d-sm-block"}>
                            <CircleDiv color={"coral"} number={entity.count_imovinsko_pravna} largestNumber={() => this.largestCount()}/>
                            <CircleDiv color={"periwinkle"} number={entity.count_poslovna} largestNumber={() => this.largestCount()}/>
                            <CircleDiv color={"dodger-blue"} number={entity.count_politicka} largestNumber={() => this.largestCount()}/>
                            <CircleDiv color={"weird-green"} number={entity.count_obiteljska} largestNumber={() => this.largestCount()}/>
                            <CircleDiv color={"sunshine-yellow"} number={entity.count_interesna} largestNumber={() => this.largestCount()}/>
                        </div>
                        <div className={showBars ? "d-none" : "d-block d-sm-none Filter-Entity-right-details-circles"}>
                            <div className={"Filter-Entity-right-details-circle-div"} style={{display: entity.count_imovinsko_pravna > 0 ? "block" : "none"}}>
                                <div className={"coral circle"}></div>
                                <span>{entity.count_imovinsko_pravna}</span> {Lang.PROPERTIES_SMALLCAPS}
                            </div>
                            <div className={"Filter-Entity-right-details-circle-div"} style={{display: entity.count_poslovna > 0 ? "block" : "none"}}>
                                <div className={"periwinkle circle"}></div>
                                <span>{entity.count_poslovna}</span> {Lang.BUSINESSES_SMALLCAPS}
                            </div>
                            <div className={"Filter-Entity-right-details-circle-div"} style={{display: entity.count_politicka > 0 ? "block" : "none"}}>
                                <div className={"dodger-blue circle"}></div>
                                <span>{entity.count_politicka}</span> {Lang.POLITICALS_SMALLCAPS}
                            </div>
                            <div className={"Filter-Entity-right-details-circle-div"} style={{display: entity.count_obiteljska > 0 ? "block" : "none"}}>
                                <div className={"weird-green circle"}></div>
                                <span>{entity.count_obiteljska}</span> {Lang.FAMILIES_SMALLCAPS}
                            </div>
                            <div className={"Filter-Entity-right-details-circle-div"} style={{display: entity.count_interesna > 0 ? "block" : "none"}}>
                                <div className={"sunshine-yellow circle"}></div>
                                <span>{entity.count_interesna}</span> {Lang.INTERESTS_SMALLCAPS}
                            </div>
                        </div>
                        <div className={"Entity-left-column-connection-circles-xyplot"}  style={showBars ? {} : {display: "none"}}>
                            <Carousel
                                activeIndex={activeIndex}
                                next={this.next}
                                previous={this.previous}
                                interval={false}
                            >
                                <CarouselIndicators items={this.items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                                {slides}
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                            </Carousel>
                        </div>
                    </div>
                    : ""
                }
                {this.state.showModal ? <EntityLogAttrData params={[this.state.attrId, this.props.params.params.id]} setModal={this.setModalShow} /> : null}
                {this.state.showModalYesNo ? <YesNoModal setModal={this.setModalShowYesNo} params={[this.state.showModalYesNo, this.props.params.loggedIn.activeUser.token]} /> : null}
            </div>

        );
    }
}
