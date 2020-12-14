import React, {Component} from 'react'
import {connect} from 'react-redux'
import {connection/*, updateConnectionData*/} from '../actions'
import ConnectionAttributes from "../components/ConnectionAttributes";

class ConnectionAttributesData extends Component {

    componentDidMount() {
        const { dispatch, params } = this.props;
        //dispatch(entity(params.id));
        dispatch(connection(params.id));

    }

    componentDidUpdate(prevProps) {
        if (this.props.params.id !== prevProps.params.id) {
            const { dispatch, params } = this.props;
            dispatch(connection(params.id));
        }
    }

    render() {
        const { result, params, dispatch, setEntity  } = this.props;
        if (result !== undefined && result.result !== undefined){
            setEntity(result.result.entity_a.public_id);
        }
        return <ConnectionAttributes params = {{result, params, dispatch}} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.connectionData !== undefined && state.rootReducer.reducer.connectionData !== null && state.rootReducer.reducer.connectionData !== []) {
        return {
            result: state.rootReducer.reducer.connectionData,
        }
    }
    else {
        return {
            result: []
        }
    }
}

export default connect(mapStateToProps)(ConnectionAttributesData);