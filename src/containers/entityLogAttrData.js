import React, {Component} from 'react'
import {connect} from 'react-redux'
import { entityLogData, updateEntityLogData } from '../actions'
import AppModal from '../components/AppModal'
import {number_per_page_by_db} from "../config"
import {store} from "../index";

class EntityLogAttrData extends Component {

    componentDidMount() {
        const { dispatch, params } = this.props;
        dispatch(entityLogData(params[0], params[1], 0, number_per_page_by_db));

    }

    componentDidUpdate(prevProps) {
        if (this.props.params[1] !== prevProps.params[1]) {
            const { dispatch, params } = this.props;
            dispatch(entityLogData(params[0], params[1], 0, number_per_page_by_db));
        }
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        this.setState({page: selected});
        let offset = Math.ceil(selected * 2);
        store.dispatch(entityLogData(this.props.params[0], this.props.params[1], offset, number_per_page_by_db));
    };

    render() {
        const { results, params, dispatch, setModal, total } = this.props;
        return <AppModal params = {{results, params, dispatch, setModal, total}} handlePageClick={this.handlePageClick} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.entityLogAttr !== undefined && state.rootReducer.reducer.entityLogAttr.results !== undefined && state.rootReducer.reducer.entityLogAttr.results !== []) {
        return {
            results: updateEntityLogData(state.rootReducer.reducer.entityLogAttr.results),
            total: updateEntityLogData(state.rootReducer.reducer.entityLogAttr.total),
        }
    }
    else {
        return {
            results: []
        }
    }
}

export default connect(mapStateToProps)(EntityLogAttrData);