import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import {RELATED_ENTITIES, CONNECTION_SMALLCAPS, CONNECTIONS_SMALLCAPS} from "../lang";

export default class EntityRelatedEntities extends Component {
    render() {
        let connections = this.props.params.results.results;
        let listItems = [];
        if(connections !== undefined && connections !== []) {
            //const tmp_connections = connections.slice(0, 3);
            const relatedEntities = connections.map((item, index) => {
                if(item.entity !== undefined && item.entity !== null) {
                    if(item.entity.movable_name !== undefined) {
                        let name = "";
                        item.entity.movable_name.map((item, index) => {
                            name += item.value + " ";
                            return null;
                        });
                        item.name = name.substr(0, name.length -1);
                    }
                    if(item.entity.real_estate_name !== undefined) {
                        let name = "";
                        item.entity.real_estate_name.map((item, index) => {
                            name += item.value + " ";
                            return null;
                        });
                        item.name = name.substr(0, name.length -1);
                    }
                    if(item.entity.savings_name !== undefined) {
                        let name = "";
                        item.entity.savings_name.map((item, index) => {
                            name += item.value + " ";
                            return null;
                        });
                        item.name = name.substr(0, name.length -1);
                    }
                    if(item.entity.legal_entity_name !== undefined) {
                        let name = "";
                        item.entity.legal_entity_name.map((item, index) => {
                            name += item.value + " ";
                            return null;
                        });
                        item.name = name.substr(0, name.length -1);
                    }
                    if(item.entity.person_last_name !== undefined || item.entity.person_first_name !== undefined) {
                        let name = "";
                        item.entity.person_first_name !== undefined && item.entity.person_first_name.map((item, index) => {
                            name += item.value + " ";
                            return null;
                        });
                        item.entity.person_last_name !== undefined && item.entity.person_last_name.map((item, index) => {
                            name += item.value + " ";
                            return null;
                        });
                        item.name = name.substr(0, name.length -1);
                    }

                    if(item.entity.public_id !== undefined) {
                        item.public_id = item.entity.public_id;
                    }

                    if(item.entity.entity_type.string_id !== undefined) {
                        item.entity_type = item.entity.entity_type.string_id;
                    }
                    delete item.entity;
                }
                return item;
            });
            listItems = relatedEntities.map((entity, index) => {
                    return <div className="Entity-right-column-related-entity"  key={index} style={{display: (entity.public_id === undefined || entity.public_id === null) ? "none" : "block" }}>
                        <Link to={"/entity/" + entity.public_id} >
                            <div className="Entity-right-column-related-entity-icon">
                                {/*entity.picture ? <img src={kosor} alt={""}/> :*/ <FontAwesomeIcon icon={entity.entity_type === "person" ? "male" : entity.entity_type === "real_estate" ? "home" : entity.entity_type === "movable" ? "car" : entity.entity_type === "savings" ? "piggy-bank"  : "building"}/>}
                            </div>
                            <div className="">
                                <p className="Entity-right-column-related-entity-name">{entity.name !== undefined && entity.name !== null && entity.name !== "" ? entity.name : "..."} </p>
                                <p className="Entity-right-column-related-entity-links">{entity.doc_count} {((entity.doc_count%10) === 2 || (entity.doc_count%10) === 3 || (entity.doc_count%10)===4)
                                && (entity.doc_count<10 || entity.doc_count>20) ? CONNECTIONS_SMALLCAPS : CONNECTION_SMALLCAPS}</p>
                            </div>
                        </Link>
                    </div>
            }

            );
        }
        return (
            <div className="Entity-right-column-related" style={{display: listItems.length > 0 ? "block" : "none"}}>
                    <h1>
                        {RELATED_ENTITIES}
                        <span className="float-right"><FontAwesomeIcon icon={["far", "user"]}/></span>
                    </h1>
                    <div>
                        {listItems}
                    </div>
            </div>
        )
    }
}