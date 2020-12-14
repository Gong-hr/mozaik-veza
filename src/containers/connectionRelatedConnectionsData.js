{/*import React, {Component} from 'react'
import {connect} from 'react-redux'
import {connectionRelatedConnections, updateConnectionRelatedConnectionsData} from '../actions'
import ConnectionRelatedConnections from "../components/ConnectionRelatedConnections";

class ConnectionRelatedConnectionsData extends Component {

    componentDidMount() {
        const { dispatch, params } = this.props;
        dispatch(connectionRelatedConnections(params[0]()));
    }

    componentDidUpdate(prevProps) {
        if (this.props.params !== prevProps.params) {
            const { dispatch, params } = this.props;
            dispatch(connectionRelatedConnections(params[0]()));
        }
    }

    render() {
        const { results, dispatch, params } = this.props;
        return <ConnectionRelatedConnections params = {{results, params, dispatch}} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.relatedConnectionsData !== undefined && state.rootReducer.reducer.relatedConnectionsData.results !== undefined && state.rootReducer.reducer.relatedConnectionsData.results !== []) {
        return {
            results: updateConnectionRelatedConnectionsData(state.rootReducer.reducer.relatedConnectionsData.results)
        }
    }
    else {
        return {
            results: []
        }
    }
}

export default connect(mapStateToProps)(ConnectionRelatedConnectionsData);

*/}