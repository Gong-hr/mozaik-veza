import {store} from './index'
import {default_url} from './config'
import 'whatwg-fetch'
import {username, password, number_per_page_by_db} from './config'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

let base64 = require('base-64');
let headers = new Headers();
username !== "" && headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));

export const SEARCH_AUTOCOMPLETE = 'SEARCH_AUTOCOMPLETE';
export const UPDATE_AUTOCOMPLETE_STATE = 'UPDATE_AUTOCOMPLETE_STATE';
export const UPDATE_SEARCH_STATE = 'UPDATE_SEARCH_STATE';
export const UPDATE_ENTITY_DATA = 'UPDATE_ENTITY_DATA';
export const DELETE_ENTITY_DATA = 'DELETE_ENTITY_DATA';
export const UPDATE_CONNECTION_DATA = 'UPDATE_CONNECTION_DATA';
export const UPDATE_CONNECTION_ATTRIBUTES_DATA = 'UPDATE_CONNECTION_ATTRIBUTES_DATA';
export const DELETE_CONNECTION_DATA = 'DELETE_CONNECTION_DATA';
export const UPDATE_ENTITY_CONNECTIONS_DATA = 'UPDATE_ENTITY_CONNECTIONS_DATA';
export const UPDATE_ENTITY_ENTITY_CONNECTIONS_DATA = 'UPDATE_ENTITY_ENTITY_CONNECTIONS_DATA';
export const UPDATE_ENTITY_RELATED_ENTITIES_DATA = 'UPDATE_ENTITY_RELATED_ENTITIES_DATA';
export const UPDATE_FILTER_CONNECTIONS_DATA = 'UPDATE_FILTER_CONNECTIONS_DATA';
export const DELETE_FILTER_CONNECTIONS_DATA = 'DELETE_FILTER_CONNECTIONS_DATA';
export const UPDATE_CONNECTION_RELATED_CONNECTIONS_DATA = 'UPDATE_CONNECTION_RELATED_CONNECTIONS_DATA';
export const SET_ENTITY_FOR_RELATED_CONNECTIONS_DATA = 'SET_ENTITY_FOR_RELATED_CONNECTIONS_DATA';
export const UPDATE_CONNECTION_TYPE_CATEGORIES_FOR_ENTITY_DATA = 'UPDATE_CONNECTION_TYPE_CATEGORIES_FOR_ENTITY_DATA';
export const UPDATE_ATTRIBUTE_DATA = 'UPDATE_ATTRIBUTE_DATA';
export const SET_CONNECTION_TYPE_CATEGORIES_DATA = 'SET_CONNECTION_TYPE_CATEGORIES_DATA';
export const UPDATE_CONNECTION_TYPE_AUTOCOMPLETE_DATA = 'UPDATE_CONNECTION_TYPE_AUTOCOMPLETE_DATA';
export const UPDATE_CONNECTION_TYPE_CATEGORIES_DATA = 'UPDATE_CONNECTION_TYPE_CATEGORIES_DATA';
export const UPDATE_LEGAL_ENTITY_TYPES_DATA = 'UPDATE_LEGAL_ENTITY_TYPES_DATA';
export const UPDATE_FILTER_DATE_FROM = 'UPDATE_FILTER_DATE_FROM';
export const UPDATE_FILTER_DATE_TO = 'UPDATE_FILTER_DATE_TO';
export const UPDATE_ENTITY_LOG_DATA = 'UPDATE_ENTITY_LOG_DATA';
export const UPDATE_CONNECTION_LOG_DATA = 'UPDATE_CONNECTION_LOG_DATA';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const UPDATE_ARTICLE_SHORT = 'UPDATE_ARTICLE_SHORT';
export const UPDATE_SOURCES = 'UPDATE_SOURCES';
export const UPDATE_ACTIVE_USER = 'UPDATE_ACTIVE_USER';
export const UPDATE_CHANGE_PASSWORD_DATA = 'UPDATE_CHANGE_PASSWORD_DATA';
export const UPDATE_CHANGE_USER_PASSWORD_DATA = 'UPDATE_CHANGE_USER_PASSWORD_DATA';
export const UPDATE_CHANGE_USER_DATA = 'UPDATE_CHANGE_USER_DATA';
export const SEND_LOST_PASSWORD_DATA = 'SEND_LOST_PASSWORD_DATA';
export const SET_SEARCH_NAME_DATA = 'SET_SEARCH_NAME_DATA';
export const SET_VERIFY_MAIL_DATA = 'SET_VERIFY_MAIL_DATA';
export const UPDATE_FOLLOWED_ENTITIES_DATA = 'UPDATE_FOLLOWED_ENTITIES_DATA';
export const UPDATE_SAVED_SEARCHES_DATA = 'UPDATE_SAVED_SEARCHES_DATA';
export const UPDATE_IS_ENTITY_FOLLOWED_DATA = 'UPDATE_IS_ENTITY_FOLLOWED_DATA';
export const SET_USER_PASSWORD_TOKEN_DATA = 'SET_USER_PASSWORD_TOKEN_DATA';
export const UPDATE_STATISTICS_DATA = 'UPDATE_STATISTICS_DATA';
export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';
export const UPDATE_EXPORT_DATA = 'UPDATE_EXPORT_DATA';


/*
 * action creators
 */

export function searchAutocomplete(text) {
    //console.log("searchAutocomplete", text);
    return {type: SEARCH_AUTOCOMPLETE, text}
}
export function updateAutocompleteState(results) {
    //console.log("updateAutocompleteState", results);
    return {type: UPDATE_AUTOCOMPLETE_STATE, results}
}
export function updateSearchState(json) {
    return {type: UPDATE_SEARCH_STATE, results: json}
}
export function updateEntityData(result, attributes, results, followed) {
    return {type: UPDATE_ENTITY_DATA, result, attributes, results, followed}
}
export function deleteEntityData(result, attributes) {
    return {type: DELETE_ENTITY_DATA, result, attributes}
}
export function updateConnectionData(result, results) {
    return {type: UPDATE_CONNECTION_DATA, result, results}
}
export function updateConnectionAttributesData(results) {
    return {type: UPDATE_CONNECTION_ATTRIBUTES_DATA, results}
}
export function deleteConnectionData(result) {
    return {type: DELETE_CONNECTION_DATA, result}
}
export function updateAttributeData(result) {
    return {type: UPDATE_ATTRIBUTE_DATA, result}
}
export function updateEntityConnectionsData(results) {
    return {type: UPDATE_ENTITY_CONNECTIONS_DATA, results}
}
export function updateEntityEntityConnectionsData(results) {
    return {type: UPDATE_ENTITY_ENTITY_CONNECTIONS_DATA, results}
}
export function updateEntityRelatedEntitiesData(results) {
    return {type: UPDATE_ENTITY_RELATED_ENTITIES_DATA, results}
}
/*export function updateConnectionRelatedConnectionsData(results) {
    return {type: UPDATE_CONNECTION_RELATED_CONNECTIONS_DATA, results}
}*/
export function setEntityForRelatedConnectionsData(text) {
    return {type: SET_ENTITY_FOR_RELATED_CONNECTIONS_DATA, text}
}
export function setConnectionTypeCategoriesData(id, search, categories, types) {
    return {type: SET_CONNECTION_TYPE_CATEGORIES_DATA, id, search, categories, types}
}
export function updateConnectionTypesAutocompleteData(category, term, results) {
    return {type: UPDATE_CONNECTION_TYPE_AUTOCOMPLETE_DATA, category, term, results}
}
export function updateConnectionTypeCategoriesData(id, search, categories, types) {
    return {type: UPDATE_CONNECTION_TYPE_CATEGORIES_DATA, id, search, categories, types}
}
export function updateConnectionTypeCategoriesForEntityData(results) {
    return {type: UPDATE_CONNECTION_TYPE_CATEGORIES_FOR_ENTITY_DATA, results}
}
export function updateFilterConnectionsData(term, results) {
    return {type: UPDATE_FILTER_CONNECTIONS_DATA, term, results}
}
export function deleteFilterConnections() {
    return {type: DELETE_FILTER_CONNECTIONS_DATA}
}
export function updateLegalEntityTypeData(results, legal) {
    return {type: UPDATE_LEGAL_ENTITY_TYPES_DATA, results, legal}
}
export function updateFilterDateFrom(result) {
    return {type: UPDATE_FILTER_DATE_FROM, result}
}
export function updateFilterDateTo(result) {
    return {type: UPDATE_FILTER_DATE_TO, result}
}
export function updateEntityLogData(results) {
    return {type: UPDATE_ENTITY_LOG_DATA, results}
}
export function updateConnectionLogData(results) {
    return {type: UPDATE_CONNECTION_LOG_DATA, results}
}
export function updateArticle(result) {
    return {type: UPDATE_ARTICLE, result}
}
export function updateArticleShort(result) {
    return {type: UPDATE_ARTICLE_SHORT, result}
}
export function updateSources(results) {
    return {type: UPDATE_SOURCES, results}
}
export function updateActiveUser(username, token) {
    return {type: UPDATE_ACTIVE_USER, username, token}
}
export function makeUserFailed(error, login) {
    return {type: UPDATE_ACTIVE_USER, error, login}
}
export function loginUserFailed(error, login) {
    return {type: UPDATE_ACTIVE_USER, error, login}
}
export function changePasswordFailed(result) {
    return {type: UPDATE_CHANGE_PASSWORD_DATA, result}
}
export function changePasswordSuccess(result) {
    return {type: UPDATE_CHANGE_PASSWORD_DATA, result}
}
export function changeUserPasswordData(result) {
    return {type: UPDATE_CHANGE_USER_PASSWORD_DATA, result}
}
export function changeUserData(result, change, error) {
    return {type: UPDATE_CHANGE_USER_DATA, result, change, error}
}
export function sendLostPasswordFailed(error) {
    return {type: SEND_LOST_PASSWORD_DATA, error}
}
export function sendLostPasswordSuccess(result) {
    return {type: SEND_LOST_PASSWORD_DATA, result}
}
export function setSearchNameFailed(error) {
    return {type: SET_SEARCH_NAME_DATA, error}
}
export function setSearchNameSuccess(result) {
    return {type: SET_SEARCH_NAME_DATA, result}
}
export function verifyMailData(result) {
    return {type: SET_VERIFY_MAIL_DATA, result}
}
export function verifyMailDataFailed(error) {
    return {type: SET_VERIFY_MAIL_DATA, error}
}
export function userPasswordTokenData(result) {
    return {type: SET_USER_PASSWORD_TOKEN_DATA, result}
}
export function userPasswordTokenDataFailed(error) {
    return {type: SET_USER_PASSWORD_TOKEN_DATA, error}
}
export function updateFollowedEntities(results) {
    return {type: UPDATE_FOLLOWED_ENTITIES_DATA, results}
}
export function updateSavedSearches(results) {
    return {type: UPDATE_SAVED_SEARCHES_DATA, results}
}
export function updateIsEntityFollowed(result) {
    return {type: UPDATE_IS_ENTITY_FOLLOWED_DATA, result}
}
export function updateStatistics(result) {
    return {type: UPDATE_STATISTICS_DATA, result}
}
export function updateExportData(results) {
    return {type: UPDATE_EXPORT_DATA, results}
}
export function removeError() {
    return {type: REMOVE_ERROR}
}
 
export function search(term, offset, limit) {
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/search/entities/autocomplete/" + term + "/" + offset + "/" + limit + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(updateSearchState(json));
                        dispatch(hideLoading());
                    }
                }
            );
    }
} 
export function entity(string_id, token, filter) {
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/search/entities/by-public_id/" + string_id + "/?format=json&full=true",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        store.dispatch({type: ADD_ERROR, error: status, site_type: "entity"});
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(entityAttributes(json, string_id, token, filter))
                    }
                }
            );
    }
}
export function entityAttributes(result, string_id, token, filter) {
    return dispatch => {
        return result !== undefined && result.result !== undefined && result.result.entity_type !== undefined && fetch(default_url + "/search/attributes/by-entity-type/" + result.result.entity_type.string_id + "/0/10000/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        if(json.total > 10000) {
                            console.log("ima ih više");
                        }
                        if(filter) {
                            store.dispatch(updateEntityData(result, json));
                            dispatch(hideLoading());
                        }
                        else {
                            store.dispatch(entityConnectionsByYear(result.result.public_id, result, json, string_id, token));
                        }
                    }
                }
            );
    }
}
export function entityConnectionsByYear(id, result, attributes, string_id, token) {
    return dispatch => {
        return fetch(default_url + "/search/connections/count-per-year-by-end/" + id + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        if(token !== undefined && token !== null && token !== "") {
                            store.dispatch(isEntityFollowed(result, attributes, json, string_id, token));
                            dispatch(hideLoading());

                        }
                        else {
                            store.dispatch(updateEntityData(result, attributes, json));
                            dispatch(hideLoading());
                        }
                    }
                }
            );
    }
}
export function entityConnections(string_id, offset, limit, filter = "", order_by = "", order_direction = "") {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    let filter_sort = 'entity=' + string_id;
    if(filter !== "") {
        filter_sort += "&connection_type_category=" + filter;
        if(order_by !== "" && order_direction !== "") {
            filter_sort += "&order_by=" + order_by + "&order_direction=" + order_direction;
        }
    }
    else {
        if(order_by !== "" && order_direction !== "") {
            filter_sort += "&order_by=" + order_by + "&order_direction=" + order_direction;
        }
    }
    return dispatch => {
        dispatch(showLoading());
        //return fetch(default_url + "/graph/connections/by-attributes-values/" + offset + '/' + limit + "/?format=json",
        return fetch(default_url + "/search/connections/by-attributes-values/" + offset + '/' + limit + "/?format=json",
            {
                method: 'POST',
                headers: tmp_headers,
                body: filter_sort
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        dispatch(hideLoading())
                    } else {
                        store.dispatch(updateEntityConnectionsData(json));
                        dispatch(hideLoading());
                    }
                }
            );
    }
}
export function entityEntityConnections(entity_a, entity_b, search, offset, limit) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    return dispatch => {
        //return fetch(default_url + "/graph/connections/by-ends/" + entity_a + '/' + entity_b + "/0/10000/?format=json",
        return fetch(default_url + "/search/connections/by-ends/" + entity_a + "/" + entity_b + "/" + offset + "/" + limit + "/?format=json",
            {
                method: 'POST',
                headers: tmp_headers,
                body: search
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateEntityEntityConnectionsData(json));
                    }
                }
            );
    }
}
export function entityRelatedEntities(string_id, offset, limit) {
    return dispatch => {
        //return fetch(default_url + "/search/connections/by-id-attributes_values/" + string_id + '/' + 0 + '/' + 3 + "?format=json",
        return fetch(default_url + "/search/entities/by-connection-count/" + string_id + "/0/3/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(entityRelatedEntitiesDetails(json.results.slice(0,3)));
                    }
                }
            );
    }
}
export function entityRelatedEntitiesDetails(array) {
    array.map((item, index) => {
        fetch(default_url + "/search/entities/by-public_id/" + item.key + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        array[index].entity = json.result;
                    }
                }
            );
        return null;
    });
    return store.dispatch(updateEntityRelatedEntitiesData(array));
}
export function connection(id) {
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/search/connections/by-id/" + id + "/?format=json&full=true",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    //console.log("json loginUser: ", json);
                    if (status >= 400) {
                        // Status looks bad
                        store.dispatch({type: ADD_ERROR, error: status, site_type: "connection"});
                        dispatch(hideLoading());
                    } else {
                        // Status looks good
                        store.dispatch(connectionAttributes(id, json))
                    }
                }
            );
    }
}
export function connectionAttributes(id, result) {
    return dispatch => {
        //return fetch(default_url + "/entity-entity-attributes/" + id + "/?limit=10000&offset=0&format=json",
        return fetch(default_url + "/search/attributes/connections/0/10000/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(updateConnectionData(result, json));
                        dispatch(hideLoading());
                    }
                }
            );
    }
}
/*export function connectionRelatedConnections(id) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    return dispatch => {
        return fetch(default_url + "/search/connections/by-attributes-values/" + 0 + '/' + 3  + "/?format=json",
            {
                method: 'POST', headers: tmp_headers, body: "entity=" + id
            })
            .then(response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => {
                store.dispatch(updateConnectionRelatedConnectionsData(json),
                //console.log("json", json)
                );
            });
    }
}*/
export function filterConnections(term, offset, limit, query_string) {
    //podaci za visjs:
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    let entity = "";
    if(term !== "") {
        entity = "&entity=" + term;
        return dispatch => {
            dispatch(showLoading());
            //return fetch(default_url + "/search/connections/by-attributes-values/" + offset + "/" + limit + "/?format=json" ,
            return fetch(default_url + "/graph/neighbours/by-attributes-values/" + offset + "/" + limit + "/?format=json",
                {
                    method: 'POST',
                    headers: tmp_headers,
                    body: query_string + "&count=true" + entity
                })
                .then(response =>
                    response.json().then(json => ({
                            status: response.status,
                            json
                        })
                    ))
                .then(
                    ({ status, json }) => {
                        if (status >= 400) {
                            console.log('An error occurred.', status);
                            dispatch(hideLoading());
                        } else {
                            store.dispatch(updateFilterConnectionsData(term, json));
                            dispatch(hideLoading());
                        }
                    }
                );
        }
    }
    else {
        return dispatch => {
            dispatch(showLoading());
            return fetch(default_url + "/search/connections/by-attributes-values/" + offset + "/" + limit + "/?format=json" ,
            //return fetch(default_url + "/graph/connections/by-attributes-values/" + offset + "/" + limit + "/?format=json",
                {
                    method: 'POST',
                    headers: tmp_headers,
                    body: query_string
                })
                .then(response =>
                    response.json().then(json => ({
                            status: response.status,
                            json
                        })
                    ))
                .then(
                    ({ status, json }) => {
                        if (status >= 400) {
                            console.log('An error occurred.', status);
                            dispatch(hideLoading());
                        } else {
                            store.dispatch(updateFilterConnectionsData(term, json));
                            dispatch(hideLoading());
                        }
                    }
                );
        }
    }
}
export function filterConnectionTypeCategories(id, search) {
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/connection-type-categories/?limit=10000&offset=0&format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(filterConnectionTypes(id, search, 0, json, []));
                    }
                }
            );
    }
}
export function filterConnectionTypes(id, search, i, connectionCategories, connectionTypes) {
    return dispatch => {
        if (connectionCategories.results[i] !== undefined) {
            let tmp = connectionCategories.results[i];
            return fetch(default_url + "/search/connection-types/by-connection-type-category/" + tmp.string_id + "/0/100/?only_count=true&format=json",
            {
                method: 'GET', headers: headers
            })
                .then(response =>
                    response.json().then(json => ({
                            status: response.status,
                            json
                        })
                    ))
                .then(
                    ({ status, json }) => {
                        if (status >= 400) {
                            console.log('An error occurred.', status);
                        } else {
                            if(json.total < (number_per_page_by_db+1)) { //n+1, where n is max number of conncetion types fetched automaticly, if there are more under conn type category, nothing is fetched until search
                                fetch(default_url + "/search/connection-types/by-connection-type-category/" + tmp.string_id + "/0/100/?format=json",
                                    {
                                        method: 'GET', headers: headers
                                    })
                                    .then(response =>
                                        response.json().then(json => ({
                                                status: response.status,
                                                json
                                            })
                                        ))
                                    .then(
                                        ({ status, json }) => {
                                            if (status >= 400) {
                                                console.log('An error occurred.', status);
                                                dispatch(hideLoading());
                                            } else {
                                                if (i < connectionCategories.results.length) {
                                                    i++;
                                                    connectionTypes[tmp.string_id] = json.results;
                                                    store.dispatch(filterConnectionTypes(id, search, i, connectionCategories, connectionTypes));
                                                }
                                            }
                                        }
                                    );
                            }
                            else {
                                i++;
                                store.dispatch(filterConnectionTypes(id, search, i, connectionCategories, connectionTypes))
                            }
                        }
                    }
                );
        }
        else {
            store.dispatch(setConnectionTypeCategoriesData(id, search, connectionCategories, connectionTypes));
            dispatch(hideLoading());
        }
    }
}
export function filterConnectionTypesAutocomplete(category, term) {
    return dispatch => {
        return fetch(default_url + "/search/connection-types/autocomplete/" + category + "/" + term + "/0/100/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateConnectionTypesAutocompleteData(json));
                    }
                }
            );
    }
}
export function filterEntityTypeData() {
    return dispatch => {
        return fetch(default_url + "/entity-types/?limit=100&offset=0&format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(filterLegalEntityTypeData(json.results));
                    }
                }
            );
    }
}
export function filterLegalEntityTypeData(results) {
    return dispatch => {
        return fetch(default_url + "/search/codebook-values/legal_entity_type/0/100?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateLegalEntityTypeData(results, json));
                    }
                }
            );
    }
}
export function entityConnectionTypeCategories() {
    return dispatch => {
        return fetch(default_url + "/connection-type-categories/?limit=100&offset=0&format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateConnectionTypeCategoriesForEntityData(json.results));
                    }
                }
            );
    }
}
export function entityLogData(attr, entity, offset, limit) {
    return dispatch => {
        return fetch(default_url + "/search/attribute-value-changes/entity/" + entity + "/" + attr + "/"+ offset + "/" + limit + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateEntityLogData(json));
                    }
                }
            );
    }
}
export function connectionLogData(attr, connection, offset, limit) {
    return dispatch => {
        return fetch(default_url + "/search/attribute-value-changes/connection/" + connection + "/" + attr + "/"+ offset + "/" + limit + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateConnectionLogData(json));
                    }
                }
            );
    }
}
export function connectionLogDetailsData(connection, offset, limit) {
    return dispatch => {
        return fetch(default_url + "/search/entity-entity-changes/" + connection + "/"+ offset + "/" + limit + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateConnectionLogData(json));
                    }
                }
            );
    }
}
export function getArticle(slug) {
    return dispatch => {
        return fetch(default_url + "/article-content-long/" + slug + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        store.dispatch({type: ADD_ERROR, error: status, site_type: "article"});
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(updateArticle(json))
                    }
                }
            );
    }
}
export function getArticleShort(slug) {
    return dispatch => {
        return fetch(default_url + "/article-content-short/" + slug + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateArticleShort(json));
                    }
                }
            );
    }
}
export function getSources() {
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/sources/?limit=10000&offset=0&format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(updateSources(json));
                        dispatch(hideLoading());
                    }
                }
            );
    }
}


/********USER STUFF: ********/
export function makeUser(username, password, email) {
    email = email !== undefined ? email : null;
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/user/?format=json",
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        json !== undefined && json !== null && dispatch(makeUserFailed(json, "signup"))
                    } else {
                        dispatch(getToken(json.username, password, "signup"))
                    }
                }
            );
    }
}
export function getToken(username, password, login) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/api-token-auth/?format=json",
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(loginUserFailed(json, login))
                    } else {
                        dispatch(getUserInfo(username, json.token));
                        dispatch(updateActiveUser(username, json.token))
                    }
                }
            );
    }
}
export function changePassword(email) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/password-change-token/?format=json",
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    email: email
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(changePasswordFailed(json))
                    } else {
                        dispatch(changePasswordSuccess(json))
                    }
                }
            );
    }
}
export function changeUserPassword(username, password, token) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&format=json"
    }
    else {
        token_format = "/?format=json"
    }
    return dispatch => {
        return fetch(default_url + "/user-password/" + username + token_format,
            {
                method: 'PUT',
                headers: tmp_headers,
                body: JSON.stringify({
                    password: password
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(changeUserPasswordData(json))
                    } else {
                        dispatch(changeUserPasswordData(json))
                    }
                }
            );
    }
}
export function changeUserInfo(username, name, surname, email, accept, token) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&format=json"
    }
    else {
        token_format = "/?format=json"
    }
    return dispatch => {
        return fetch(default_url + "/user/" + username + token_format,
            {
                method: 'PUT',
                headers: tmp_headers,
                body: JSON.stringify({
                    first_name: name,
                    last_name: surname,
                    email: email,
                    send_notification_on_change_watched_entity: accept
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(changeUserData(json, "change", "error"))
                    } else {
                        dispatch(changeUserData(json, "change"))
                    }
                }
            );
    }
}
export function getUserInfo(username, token) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&format=json"
    }
    else {
        token_format = "/?format=json"
    }
    return dispatch => {
        return fetch(default_url + "/user/" + username + token_format,
            {
                method: 'GET',
                headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(changeUserData(json, "get"))
                    } else {
                        dispatch(changeUserData(json, "get"))
                    }
                }
            );
    }
}
export function sendLostPassword(email) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/password-change-token/?format=json",
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    email: email
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(sendLostPasswordFailed(json))
                    } else {
                        dispatch(sendLostPasswordSuccess(json))
                    }
                }
            );
    }
}
export function followEntity(entity_id, token) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "auth_token=" + token + "&format=json"
    }
    else {
        token_format = "format=json"
    }
    return dispatch => {
        return fetch(default_url + "/user-entity/?" + token_format,
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    entity: entity_id
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                    } else {
                        dispatch(updateIsEntityFollowed(json))
                    }
                }
            );
    }
}
export function unfollowEntity(id, token) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token
    }
    else {
        token_format = ""
    }
    return dispatch => {
        return fetch(default_url + "/user-entity/" + id + token_format,
            {
                method: 'DELETE', headers: headers

            })
            .then(response =>
                response)
            .then(
                ({ status }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        dispatch(followedEntities(token, 0, number_per_page_by_db));
                        dispatch(updateIsEntityFollowed(""))
                    }
                }
            );
    }
}
export function followedEntities(token, offset, limit) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&limit=" + limit + "&offset=" + offset + "&format=json"
    }
    else {
        token_format = "/?limit=" + limit + "&offset=" + offset + "&format=json"
    }
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/user-entity" + token_format,
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        dispatch(hideLoading());
                    } else {
                        if(json.count < 1) {
                            dispatch(hideLoading());
                            store.dispatch(updateFollowedEntities(""));
                        }
                        else {
                            getfollowedEntitiesData(json);
                        }
                    }
                }
            );
    }
}
export function getfollowedEntitiesData(array) {
    let j = 0;
    function finish(i, json) {
        j++;
        array.results[i].entity = json.result;
        if(j === array.results.length) {
            store.dispatch(updateFollowedEntities(array));
            store.dispatch(hideLoading());
        }
    }
    for (let i = 0; i < array.results.length; i++) {
        let item = array.results[i];
        fetch(default_url + "/search/entities/by-public_id/" + item.entity.public_id + "/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        store.dispatch(hideLoading());
                    } else {
                        finish(i, json);
                    }
                }
            );
    }
}
export function isEntityFollowed(result, attributes, array, id, token) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&format=json"
    }
    else {
        token_format = "/?format=json"
    }
    return dispatch => {
        return fetch(default_url + "/user-entity/" + id + token_format,
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        //console.log('An error occurred.', status);
                        store.dispatch(updateEntityData(result, attributes, array, json));
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(updateEntityData(result, attributes, array, json));
                        dispatch(hideLoading());
                    }
                }
            );
    }
}
export function savedSearch(token, offset, limit) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&limit=" + limit + "&offset=" + offset + "&format=json"
    }
    else {
        token_format = "/?limit=" + limit + "&offset=" + offset + "&format=json"
    }
    return dispatch => {
        dispatch(showLoading());
        return fetch(default_url + "/saved-search" + token_format,
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                        dispatch(hideLoading());
                    } else {
                        store.dispatch(updateSavedSearches(json));
                        dispatch(hideLoading());
                    }
                }
            );
    }
}
export function setSavedLink(name, link, token) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&limit=10000&offset=0&format=json"
    }
    else {
        token_format = "/?limit=10000&offset=0&format=json"
    }
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/saved-search" + token_format,
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    saved_url: link,
                    name: name
                })
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(setSearchNameFailed(json))
                    } else {
                        dispatch(setSearchNameSuccess(json))
                    }
                }
            );
    }
}
export function deleteSavedSearch(link, token) {
    let token_format = "";
    if(token !== undefined && token !== null && token !== "") {
        token_format = "/?auth_token=" + token + "&format=json"
    }
    else {
        token_format = "/?format=json"
    }
    return dispatch => {
        return fetch(default_url + "/saved-search/" + link + token_format,
            {
                method: 'DELETE', headers: headers

            })
            .then(response => response.status
                //response.json().then(json => ({

                        //json
                    //})
                //)
    )
            .then(
                ({ status }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(savedSearch(token));
                    }
                }
            );
    }
}
export function verifyMail(user, token) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/verify-email/",
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    username: user,
                    verification_token: token
                })
            })
            .then(
                response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ),
                error => dispatch(verifyMailDataFailed(error)))//console.log('An error occurred.', error),
            .then(
                ({ status, json }) => {
                    //console.log("json verifyMail: ", json);
                    if (status >= 400) {
                        // Status looks bad
                        dispatch(verifyMailDataFailed(json))
                    } else {
                        // Status looks good
                        dispatch(verifyMailData(json))
                    }
                }
            );
    }
}
export function userPasswordToken(user, token, password) {
    let tmp_headers = new Headers(headers);
    tmp_headers.append("Content-Type", "application/json; charset=utf-8");
    return dispatch => {
        return fetch(default_url + "/user-password-token/",
            {
                method: 'POST',
                headers: tmp_headers,
                body: JSON.stringify({
                    username: user,
                    token: token,
                    password: password
                })
            })
            .then(
                response => response.json().then(json => ({
                    status: response.status,
                    json
                })),
                error => dispatch(userPasswordTokenDataFailed("error"))
            )
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        dispatch(userPasswordTokenDataFailed(json))
                    } else {
                        dispatch(userPasswordTokenData(json))
                    }
                }
            );
    }
}
export function statistics() {
    return dispatch => {
        return fetch(default_url + "/search/objects-count/?format=json",
            {
                method: 'GET', headers: headers
            })
            .then(response =>
                response.json().then(json => ({
                        status: response.status,
                        json
                    })
                ))
            .then(
                ({ status, json }) => {
                    if (status >= 400) {
                        console.log('An error occurred.', status);
                    } else {
                        store.dispatch(updateStatistics(json));
                    }
                }
            );
    }
}
