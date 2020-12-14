import React, {Component} from 'react'
import {connect} from 'react-redux'
import {followedEntities} from '../actions'
import SavedEntity from "../components/SavedEntity"
import {store} from "../index"
import {number_per_page_by_db} from "../config"

class SavedEntitiesData extends Component {

    componentDidMount() {
        const { dispatch, loggedIn } = this.props;
        if(loggedIn.activeUser !== undefined && loggedIn.activeUser.token !== undefined) {
            dispatch(followedEntities(loggedIn.activeUser.token, 0 , number_per_page_by_db));
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.params !== prevProps.params) {
            const { dispatch, loggedIn } = this.props;
            if(loggedIn.activeUser !== undefined && loggedIn.activeUser.token !== undefined) {
                dispatch(followedEntities(loggedIn.activeUser.token, 0, number_per_page_by_db));
            }
        }
    }

    handlePageClick = (results) => {
        let selected = results.selected;
        this.setState({page: selected});
        let offset = Math.ceil(selected * number_per_page_by_db);
        if(this.props.loggedIn.activeUser !== undefined && this.props.loggedIn.activeUser.token !== undefined) {
            store.dispatch(followedEntities(this.props.loggedIn.activeUser.token, offset, number_per_page_by_db));
        }
        else {
            store.dispatch(followedEntities("", offset, number_per_page_by_db));
        }
    };

    render() {
        const { results, dispatch, loggedIn, total } = this.props;
        return <SavedEntity params = {{ results, dispatch, loggedIn, total }} handlePageClick={this.handlePageClick} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.followedEntities.results !== undefined) {
        return {
            results: state.rootReducer.reducer.followedEntities.results,
            total: state.rootReducer.reducer.followedEntities.count,
        }
    }
    else {
        return {
            results: []
        }
    }
}

export default connect(mapStateToProps)(SavedEntitiesData);