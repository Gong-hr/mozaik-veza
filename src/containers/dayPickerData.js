import {connect} from 'react-redux'
import {updateFilterDateFrom, updateFilterDateTo} from '../actions'
import DayPicker from '../components/DayPicker'

function mapStateToProps(state, ownProps) {
    return {
        from: updateFilterDateFrom(state.rootReducer.reducer.filterDateFrom),
        to: updateFilterDateTo(state.rootReducer.reducer.filterDateTo),
        ownProps: ownProps
    }
}

export default connect(
    mapStateToProps/*,
    mapDispatchToProps*/
)(DayPicker);
