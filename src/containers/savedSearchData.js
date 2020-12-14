import React, {Component} from 'react'
import {connect} from 'react-redux'
import {savedSearch} from '../actions'
import SavedSearches from "../components/SavedSearches";
import {store} from "../index"
import {number_per_page_by_db} from "../config"

class SavedSearchesData extends Component {

    componentDidMount() {
        const { dispatch, loggedIn } = this.props;
        dispatch(savedSearch(loggedIn.activeUser.token, 0 , number_per_page_by_db));
    }

    componentDidUpdate(prevProps) {
        if (this.props.params !== prevProps.params) {
            const { dispatch, loggedIn } = this.props;
            dispatch(savedSearch(loggedIn.activeUser.token, 0 , number_per_page_by_db));
        }
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        this.setState({page: selected});
        let offset = Math.ceil(selected * number_per_page_by_db);
        if(this.props.loggedIn.activeUser !== undefined && this.props.loggedIn.activeUser.token !== undefined) {
            store.dispatch(savedSearch(this.props.loggedIn.activeUser.token, offset, number_per_page_by_db));
        }
        else {
            store.dispatch(savedSearch("", offset, number_per_page_by_db));
        }
    };

    render() {
        const { results, dispatch, loggedIn, total } = this.props;
        return <SavedSearches params = {{ results, dispatch, loggedIn, total }} handlePageClick={this.handlePageClick} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.savedSearchData.results !== undefined && state.rootReducer.reducer.savedSearchData.results !== undefined && state.rootReducer.reducer.savedSearchData.results !== []) {
        return {
            results: state.rootReducer.reducer.savedSearchData.results,
            total: state.rootReducer.reducer.savedSearchData.count
        }
    }
    else {
        return {
            results: []
        }
    }
}

export default connect(mapStateToProps)(SavedSearchesData);