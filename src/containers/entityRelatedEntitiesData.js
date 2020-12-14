import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateEntityRelatedEntitiesData, entityRelatedEntities} from '../actions'
import EntityRelatedEntities from "../components/EntityRelatedEntities";

class EntityRelatedEntitiesData extends Component {

    componentDidMount() {
        const { dispatch, id } = this.props;
        dispatch(entityRelatedEntities(id));
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            const { dispatch, id } = this.props;
            dispatch(entityRelatedEntities(id));
        }
    }

    render() {
        const { results, total, id, dispatch, setModal } = this.props;
        return <EntityRelatedEntities params = {{results, total, id, dispatch, setModal}} />;
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.relatedEntitiesData.results !== undefined && state.rootReducer.reducer.relatedEntitiesData.results !== undefined && state.rootReducer.reducer.relatedEntitiesData.results !== []) {
        return {
            results: updateEntityRelatedEntitiesData(state.rootReducer.reducer.relatedEntitiesData.results)
        }
    }
    else {
        return {
            results: []
        }
    }
}

export default connect(mapStateToProps)(EntityRelatedEntitiesData);