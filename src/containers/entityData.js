import React, { Component } from 'react'
import { connect } from 'react-redux'
import { entity } from '../actions'
import EntityAttributes from '../components/EntityAttributes'
import { loadState } from "../localStorage"

class EntityData extends Component {

    componentDidMount() {
        const { dispatch, params } = this.props;
        let token = loadState("activeUser") !== undefined && loadState("activeUser").activeUser !== undefined && loadState("activeUser").activeUser.token !== undefined ?
            loadState("activeUser").activeUser.token : "";
        dispatch(entity(params.id, token));
    }

    componentDidUpdate(prevProps) {
        if (this.props.params.id !== prevProps.params.id) {
            const { dispatch, params } = this.props;
            let token = loadState("activeUser") !== undefined && loadState("activeUser").activeUser !== undefined && loadState("activeUser").activeUser.token !== undefined ?
                loadState("activeUser").activeUser.token : "";
            dispatch(entity(params.id, token));
            /*if(loggedIn !== undefined && loggedIn.activeUser !== undefined) {
                dispatch(entity(params.id, loggedIn.activeUser.token));
            }
            else if(loggedIn !== undefined && loggedIn !== "" ) {
                dispatch(entity(params.id, loggedIn));
            }*/
        }
    }

    render() {
        const { result, params, dispatch, loggedIn, setFollowEntity, attributes, results, followed } = this.props;
        if(result.public_id !== undefined) return <EntityAttributes params = {{ result, params, dispatch, loggedIn, setFollowEntity, attributes, results, followed }} />;
        else return null
    }
}

function mapStateToProps(state) {
    if(state.rootReducer.reducer.entityData.result !== undefined && state.rootReducer.reducer.entityData.result !== undefined && state.rootReducer.reducer.entityData.result !== []) {
        return {
            //result: updateEntityData(state.rootReducer.reducer.entityData.result, state.rootReducer.reducer.entityAttributes, state.rootReducer.reducer.entityConnectionsByYearData, state.rootReducer.reducer.followed),
            attributes: state.rootReducer.reducer.entityAttributes,
            followed: state.rootReducer.reducer.followed,
            results: state.rootReducer.reducer.entityConnectionsByYearData,
            result: state.rootReducer.reducer.entityData.result
        }
    }
    else {
        return {
            result: []
        }
    }
}

export default connect(mapStateToProps)(EntityData);