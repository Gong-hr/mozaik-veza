import {connect} from 'react-redux'
import {updateAutocompleteState} from '../actions'
import SearchAutocompleteList from '../components/SearchAutocompleteList'

function mapStateToProps(state) {
    return {
        results: updateAutocompleteState(state.rootReducer.reducer.autocompleteList)
    }
}

export default connect(mapStateToProps)(SearchAutocompleteList);
