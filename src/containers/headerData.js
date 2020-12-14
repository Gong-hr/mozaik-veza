import React, {Component} from 'react'
import {connect} from 'react-redux'
//import {updateActiveUser} from "../actions"
import Header from "../components/Header";

class HeaderData extends Component {

    componentDidUpdate(prevProps) {
        if (this.props.params !== prevProps.params) {
            //const { dispatch, loggedIn } = this.props;
            //dispatch(updateActiveUser());
        }
    }

    render() {
        const { results, dispatch, loggedIn, setLoggedIn, id } = this.props;
        return <Header params = {{ results, dispatch, loggedIn, setLoggedIn, id}} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.activeUser !== undefined && state.rootReducer.reducer.activeUser.result !== undefined ) {
        return {
            result: state.rootReducer.reducer.activeUser.result,
        }
    }
    else {
        return {
            result: []
        }
    }
}

export default connect(mapStateToProps)(HeaderData);