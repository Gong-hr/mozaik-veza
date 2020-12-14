import React, {Component} from 'react'
import {connect} from 'react-redux'
import {number_per_page} from "../config"
import {updateEntityConnectionsData, entityConnections, entityConnectionTypeCategories} from '../actions'
import EntityConnections from "../components/EntityConnections";

class EntityConnectionsData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            limit: number_per_page
        }
    }

    componentDidMount() {
        const { dispatch, params, filter, order_by, order_direction } = this.props;
        dispatch(entityConnections(params.id, this.state.offset, this.state.limit, filter, order_by, order_direction ));
        dispatch(entityConnectionTypeCategories());
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.params.id !== prevProps.params.id || prevState.offset !== this.state.offset || prevState.limit !== this.state.limit) {
            const { dispatch, params, filter, order_by, order_direction } = this.props;
            dispatch(entityConnections(params.id, this.state.offset, this.state.limit, filter, order_by, order_direction));
        }
    }

    fetch(offset, limit) {
        if(offset !== this.state.offset || limit !== this.state.limit) {
            const { dispatch, params, filter, order_by, order_direction } = this.props;
            dispatch(entityConnections(params.id, offset, limit, filter, order_by, order_direction));
        }
    }

    render() {
        const { results, total, categories, params, dispatch, min_valid, max_valid, handleConnectionTypeChange, filter, handleSortConnectionChange, order_by, order_direction, location} = this.props;
        return <EntityConnections params = {{results, categories, total, params, dispatch, min_valid, max_valid, handleConnectionTypeChange, filter, handleSortConnectionChange, order_by, order_direction, location}} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.connectionsData.results !== undefined && state.rootReducer.reducer.connectionsData.results !== undefined && state.rootReducer.reducer.connectionsData.results !== []) {
        return {
            results: updateEntityConnectionsData(state.rootReducer.reducer.connectionsData.results),
            total: updateEntityConnectionsData(state.rootReducer.reducer.connectionsData.total),
            min_valid: updateEntityConnectionsData(state.rootReducer.reducer.connectionsData.min_valid),
            max_valid: updateEntityConnectionsData(state.rootReducer.reducer.connectionsData.max_valid),
            categories: state.rootReducer.reducer.connectionsTypeCategoryData
        }
    }
    else {
        return {
            results: [],
            total: 0
        }
    }
}

export default connect(mapStateToProps)(EntityConnectionsData);