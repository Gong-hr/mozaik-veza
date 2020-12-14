{/*
import React, {Component} from 'react'

import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {connectionRelatedConnections} from '../actions'
//import {store} from "../index"
import "../styles/ConnectedConnections.css"

export default class ConnectionRelatedConnections extends Component {
    componentDidMount() {
        //const { dispatch, params, results } = this.props.params;
        //dispatch(connectionRelatedConnections());
    }
    componentDidUpdate(prevProps) {
        if (this.props.params !== prevProps.params) {
            const { dispatch, results } = this.props.params;
            if(results.results !== undefined){
                if(this.props.params.params[0]() !== undefined && results.results.length === 0) {
                    const id = this.props.params.params[0]();
                    dispatch(connectionRelatedConnections(id));
                }
            }


            //dispatch(connectionRelatedConnections(params[0]()));
        }
    }
    render() {
        const connectedConnections = this.props.params.results.results;
        let listItems = [];
        let iconType = "grey";
        if(connectedConnections !== undefined) {
                listItems = connectedConnections.map((entity, index) =>
                <div className="Connection-right-column-related-Connection" key={index} >
                    <div style={{display: "none"}}>{iconType =  entity.connection_type_category.string_id.substring(0, 3)}</div>
                    <Link to={"/connection/" + entity.public_id}>
                        <div className={"Connection-right-column-related-Connection-dates"}>
                            <abbr className={"connection-type-abbr " + iconType} title={entity.connection_type_category.name}>
                                {iconType.toUpperCase()}
                            </abbr>
                            {" "}{entity.valid_from} {entity.valid_to !== null && " - "} {entity.valid_to}
                        </div>
                        <div className={"Connection-right-column-related-Connection-info"}>
                            <div className={"image-div"}>
                                <div className={"crta " + iconType.toUpperCase() + "background"}></div>
                                <div className={"krug " + iconType.toUpperCase() + "background"}></div>
                            </div>
                            <div className={"Connection-right-column-related-Connection-info-div"}>
                                <p className="Connection-right-column-related-Connection-name">{entity.entity_a.name}</p>
                                <p className="Connection-right-column-related-Connection-position">{entity.connection_type.name}</p>
                                <p className="Connection-right-column-related-Connection-name">{entity.entity_b.name}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        }
        return (
            <div style={{display: listItems.length > 0 ? "block" : "none"}}>
                <h1>
                    Povezane veze
                    <span className="float-right"><FontAwesomeIcon icon={["fas", "arrows-alt-h"]} /></span>
                </h1>
                {listItems}
            </div>
        )
    }
}
*/}