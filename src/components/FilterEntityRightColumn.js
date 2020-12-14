import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'
import {store} from "../index"
import {entity, entityConnections, deleteEntityData} from "../actions"
import EntityAttributes from '../components/EntityAttributes'
import * as Lang from "../lang"

export default class FilterEntityRightColumn extends Component {

    componentDidUpdate() {
        let tmp = "";
        if (store.getState().rootReducer.reducer.entityData !== tmp
            && ((store.getState().rootReducer.reducer.entityData.length !== undefined && store.getState().rootReducer.reducer.entityData.length > 0)
            || (store.getState().rootReducer.reducer.entityData.result !== undefined && store.getState().rootReducer.reducer.entityData.result.public_id !== ""))) {
            tmp = store.getState().rootReducer.reducer.entityData;
            if(store.getState().rootReducer.reducer.connectionsData.results !== undefined && store.getState().rootReducer.reducer.connectionsData.results.length > 0
                && store.getState().rootReducer.reducer.connectionsData.results[0].entity_a !== undefined && store.getState().rootReducer.reducer.connectionsData.results[0].entity_a !== null ) {
                store.dispatch(entityConnections(store.getState().rootReducer.reducer.connectionsData.results[0].entity_a.public_id, 0, 0));
            }
            if (tmp.result === undefined || tmp.result.public_id === "") {
                store.dispatch(entity(tmp, "", "filter"));
            }
        }
    }

    hideComponent() {
        store.dispatch(deleteEntityData());
    }

    render() {
        const showEntity = store.getState().rootReducer.reducer.entityData.result !== undefined && store.getState().rootReducer.reducer.entityData.result.public_id !== undefined;
        let person = false;
        let legal = false;
        let realEstate = false;
        let movable = false;
        let savings = false;
        let name = "";
        let tmp_entity;
        if(store.getState().rootReducer.reducer.entityData.result !== undefined && store.getState().rootReducer.reducer.entityData.result !== null) {
            tmp_entity = store.getState().rootReducer.reducer.entityData.result;
            if(tmp_entity.entity_type.string_id !== undefined ) {
                if(tmp_entity.entity_type.string_id === "person") {
                    person = true
                }
                else if(tmp_entity.entity_type.string_id === "legal_entity") {
                    legal = true
                }
                else if(tmp_entity.entity_type.string_id === "real_estate") {
                    realEstate = true
                }
                else if(tmp_entity.entity_type.string_id === "movable") {
                    movable = true
                }
                else if(tmp_entity.entity_type.string_id === "savings") {
                    savings = true
                }
            }

            name = <span>
                {
                    person ?
                        (tmp_entity.person_first_name !== undefined &&
                            tmp_entity.person_first_name.map((first_name) => {
                                return first_name.value + " "
                            }))
                        : ""
                }
                {
                    person ?
                        tmp_entity.person_last_name !== undefined ?
                        tmp_entity.person_last_name.map((last_name, index) => {
                            return last_name.value + " "
                        })
                        :
                            tmp_entity.person_first_name === undefined ? "..." : "" : ""
                }
                {
                    legal ?
                        tmp_entity.legal_entity_name !== undefined ?
                        tmp_entity.legal_entity_name.map((name, index) => {
                            return name.value + " "
                        })
                        : "..."
                        : ""
                }
                {
                    realEstate ?
                        tmp_entity.real_estate_name !== undefined ?
                        tmp_entity.real_estate_name.map((name, index) => {
                            return name.value + " "
                        })
                        : "..."
                        : ""
                }
                {
                    movable ?
                        tmp_entity.movable_name !== undefined ?
                        tmp_entity.movable_name.map((name, index) => {
                            return name.value + " "
                        })
                        : "..."
                        : ""
                }
                {
                    savings ?
                        tmp_entity.savings_name !== undefined ?
                        tmp_entity.savings_name.map((name, index) => {
                            return name.value + " "
                        })
                        : "..."
                        : ""
                }
            </span>;
        }
        let ifEntity = false;
        let total = 0;
        if(tmp_entity !== undefined && tmp_entity.public_id !== undefined) {
            ifEntity = true;
            total = tmp_entity.count_imovinsko_pravna + tmp_entity.count_poslovna + tmp_entity.count_politicka + tmp_entity.count_obiteljska + tmp_entity.count_interesna;
        }
        return (
            ifEntity &&
            <div className={"Filter-Entity-right"} style={{ display: showEntity ? "block" : "none" }}>
                <div className={"Filter-Entity-right-Header"}>
                    <span className={"Filter-Entity-right-Header-title"}>{Lang.ENTITY} </span>
                    <div className={"Filter-Entity-right-Header-close"}>
                        <button style={{background: "transparent", border: "none"}}
                                onClick={() => this.hideComponent()}>
                            <span className={"font-awesome-holder"}><FontAwesomeIcon icon={"times"}/></span>
                        </button>
                    </div>
                </div>
                <div className={"Filter-Entity-right-details"}>
                    <h1>{name}</h1>
                    <EntityAttributes params = {{entityData: store.getState().rootReducer.reducer.entityData, entityAttributes: store.getState().rootReducer.reducer.entityAttributes}} />
                    <div className="Filter-Entity-right-details-more-div">
                        <Link to={"/entity/"+ tmp_entity.public_id} target={"_blank"}>
                            {Lang.OPEN_ENTITY}
                            <div className="font-awesome-holder"><FontAwesomeIcon icon={"long-arrow-alt-right"}/></div>
                        </Link>
                    </div>

                    <h2>{total} {((total%10) === 2 || (total%10) === 3 || (total%10)===4)
                    && (total<10 || total>20) ?
                        " "+Lang.CONNECTIONS : " "+Lang.CONNECTION}</h2>
                    <div className="Filter-Entity-right-details-circles">
                        <div className={"Filter-Entity-right-details-circle-div"} style={{display: tmp_entity.count_imovinsko_pravna > 0 ? "block" : "none"}}>
                            <div className={"coral circle"}></div>
                            <span>{tmp_entity.count_imovinsko_pravna}</span> {Lang.PROPERTIES_SMALLCAPS}
                        </div>
                        <div className={"Filter-Entity-right-details-circle-div"} style={{display: tmp_entity.count_poslovna > 0 ? "block" : "none"}}>
                            <div className={"periwinkle circle"}></div>
                            <span>{tmp_entity.count_poslovna}</span> {Lang.BUSINESSES_SMALLCAPS}
                        </div>
                        <div className={"Filter-Entity-right-details-circle-div"} style={{display: tmp_entity.count_politicka > 0 ? "block" : "none"}}>
                            <div className={"dodger-blue circle"}></div>
                            <span>{tmp_entity.count_politicka}</span> {Lang.POLITICALS_SMALLCAPS}
                        </div>
                        <div className={"Filter-Entity-right-details-circle-div"} style={{display: tmp_entity.count_obiteljska > 0 ? "block" : "none"}}>
                            <div className={"weird-green circle"}></div>
                            <span>{tmp_entity.count_obiteljska}</span> {Lang.FAMILIES_SMALLCAPS}
                        </div>
                        <div className={"Filter-Entity-right-details-circle-div"} style={{display: tmp_entity.count_interesna > 0 ? "block" : "none"}}>
                            <div className={"sunshine-yellow circle"}></div>
                            <span>{tmp_entity.count_interesna}</span> {Lang.INTERESTS_SMALLCAPS}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
