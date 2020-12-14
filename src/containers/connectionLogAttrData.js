import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    connectionLogData,
    updateConnectionLogData,
    connectionLogDetailsData,
} from '../actions'
import AppModal from '../components/AppModal'
import {number_per_page_by_db} from "../config";
import {store} from "../index";

class ConnectionLogAttrData extends Component {

    componentDidMount() {
        const { dispatch, params } = this.props;
        if(params[0] !== undefined && params[0] !== null) {
            dispatch(connectionLogData(params[0], params[1], 0, number_per_page_by_db));
        }
        else {
            dispatch(connectionLogDetailsData(params[1], 0, number_per_page_by_db));
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.params[1] !== prevProps.params[1]) {
            const { dispatch, params } = this.props;
            dispatch(connectionLogData(params[0], params[1], 0, number_per_page_by_db));
        }
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        this.setState({page: selected});
        let offset = Math.ceil(selected * 2);
        store.dispatch(connectionLogData(this.props.params[0], this.props.params[1], offset, number_per_page_by_db));
    };

    render() {
        const { results, params, dispatch, setModal, total } = this.props;
        return <AppModal params = {{results, params, dispatch, setModal, total}} handlePageClick={this.handlePageClick} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.connectionLogAttr !== undefined && state.rootReducer.reducer.connectionLogAttr.results !== undefined && state.rootReducer.reducer.connectionLogAttr.results !== []) {
        return {
            //results: updateConnectionLogData(state.rootReducer.reducer.connectionLogAttr),
            results: updateConnectionLogData(state.rootReducer.reducer.connectionLogAttr.results),
            total: updateConnectionLogData(state.rootReducer.reducer.connectionLogAttr.total),
        }
    }
    else {
        return {
            results: []
        }
    }
}

export default connect(mapStateToProps)(ConnectionLogAttrData);