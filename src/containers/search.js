import React, { Component } from 'react'
import {connect} from 'react-redux'
import {updateSearchState, search } from '../actions'
import SearchResults from '../components/SearchResults'

class Search extends Component {

    componentDidMount() {
        const { dispatch, params } = this.props;
        dispatch(search(params.term, params.offset, params.limit));
    }

    componentDidUpdate(prevProps) {
        if (this.props.params.term !== prevProps.params.term || this.props.params.offset !== prevProps.params.offset || this.props.params.limit !== prevProps.params.limit) {
            const { dispatch, params } = this.props;
            dispatch(search(params.term, params.offset, params.limit));
        }
    }

    render() {
        const { params, results, total, handleLimitChange } = this.props;
        return <SearchResults params = { params } results = { results } total = { total } handleLimitChange = {handleLimitChange} />;
    }
}


const mapStateToProps = state => {
    return {
        results: updateSearchState(state.rootReducer.reducer.searchList),
        total: updateSearchState(state.rootReducer.reducer.searchListTotal)
    }
};

export default connect(mapStateToProps)(Search);