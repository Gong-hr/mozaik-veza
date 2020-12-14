import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import PersonalError from '../components/PersonalError'

function mapStateToProps(state) {
    return {
        results: state.rootReducer.reducer.changeUserData,
        errors: state.rootReducer.reducer.changeUserDataErrors,
        change: state.rootReducer.reducer.userDataChanged,
        error: state.rootReducer.reducer.changeUserDataFinishError
    }
}

export default withRouter(connect(
    mapStateToProps/*,
    mapDispatchToProps*/
)(PersonalError));