import {
    SEARCH_AUTOCOMPLETE,
    UPDATE_AUTOCOMPLETE_STATE,
    UPDATE_ENTITY_DATA,
    UPDATE_SEARCH_STATE,
    DELETE_ENTITY_DATA,
    UPDATE_CONNECTION_DATA,
    DELETE_CONNECTION_DATA,
    UPDATE_CONNECTION_RELATED_CONNECTIONS_DATA,
    SET_ENTITY_FOR_RELATED_CONNECTIONS_DATA,
    UPDATE_ENTITY_CONNECTIONS_DATA,
    UPDATE_ENTITY_ENTITY_CONNECTIONS_DATA,
    UPDATE_ENTITY_RELATED_ENTITIES_DATA,
    UPDATE_FILTER_CONNECTIONS_DATA,
    UPDATE_ATTRIBUTE_DATA,
    updateAutocompleteState,
    SET_CONNECTION_TYPE_CATEGORIES_DATA,
    UPDATE_CONNECTION_TYPE_CATEGORIES_DATA,
    UPDATE_CONNECTION_TYPE_CATEGORIES_FOR_ENTITY_DATA,
    UPDATE_CONNECTION_TYPE_AUTOCOMPLETE_DATA,
    UPDATE_LEGAL_ENTITY_TYPES_DATA,
    UPDATE_FILTER_DATE_FROM,
    UPDATE_FILTER_DATE_TO,
    UPDATE_ENTITY_LOG_DATA,
    UPDATE_CONNECTION_LOG_DATA,
    UPDATE_ARTICLE,
    UPDATE_ARTICLE_SHORT,
    UPDATE_SOURCES,
    UPDATE_ACTIVE_USER,
    UPDATE_CHANGE_PASSWORD_DATA,
    UPDATE_CHANGE_USER_DATA,
    UPDATE_CHANGE_USER_PASSWORD_DATA,
    SEND_LOST_PASSWORD_DATA,
    SET_SEARCH_NAME_DATA,
    UPDATE_FOLLOWED_ENTITIES_DATA,
    UPDATE_SAVED_SEARCHES_DATA,
    SET_VERIFY_MAIL_DATA,
    SET_USER_PASSWORD_TOKEN_DATA, UPDATE_IS_ENTITY_FOLLOWED_DATA, UPDATE_STATISTICS_DATA,
    DELETE_FILTER_CONNECTIONS_DATA,
    ADD_ERROR,
    REMOVE_ERROR,
    UPDATE_EXPORT_DATA,
} from './actions'
import {store} from './index'
import {default_url} from './config'
import 'whatwg-fetch'
import {username, password} from './config'

import person_default from './images/icon-person-default.svg'
import person_active from './images/icon-person-active.svg'
import person_pep from './images/icon-person-highlight.svg'
import company_default from './images/icon-company-default.svg'
import company_active from './images/icon-company-active.svg'
import company_pep from './images/icon-company-highlight.svg'
import home_default from './images/icon-home-default.svg'
import home_active from './images/icon-home-active.svg'
import home_pep from './images/icon-home-highlight.svg'
import car_default from './images/icon-car-default.svg'
import car_active from './images/icon-car-active.svg'
import car_pep from './images/icon-car-highlight.svg'
import piggyBank_default from './images/icon-piggy-bank-default.svg'
import piggyBank_active from './images/icon-piggy-bank-active.svg'
import piggyBank_pep from './images/icon-piggy-bank-highlight.svg'
import {loadState} from "./localStorage"
import {VIZUALIZATION_TOOLTIP_ENTITY, VIZUALIZATION_TOOLTIP_CONN, CONNECTION, CONNECTIONS, ENTITY, AND} from "./lang"

let base64 = require('base-64');
let headers = new Headers();
username !== "" && headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));

const initialState = {
    autocompleteList: [],
    searchList: [],
    entityData: [],
    entity_a: "",
    attributeData: [],
    connectionsData: [],
    connectionData: [],
    connectionAttributesData: [],
    //totalNumberConnections: 0,
    relatedEntitiesData: [],
    totalNumberResults: 0,
    searchListTotal: 0,
    connectionsTypeCategoryData: [],
    connectionsTypeAutocompleteData: [],
    entityEntityConnectionsData: [],
    entityConnectionsByYearData: [],
    graph: {
        nodes: [],
        edges: []
    },
    filterConnectionCheckboxes: [],
    filterConnections: [],
    filterEntityCheckboxes: [],
    connectionsTypesData: [],
    entityTypesData: [],
    entityTypesLegalDataTotal: 0,
    connectionsTypeCategoryChecked: [],
    entityTypeCategoryChecked: [],
    isPepChecked: null,
    filterDateFrom: "",
    filterDateTo: "",
    entityLogAttr: [],
    connectionLogAttr: [],
    article: "",
    articleShort: "",
    sources: [],
    activeUser: loadState("activeUser") ? loadState("activeUser").activeUser : "",
    activeUserError: [],
    activeUserTokenError: [],
    token: "",
    changePassword: "",
    changeUserData: [],
    changeUserDataFinish: false,
    changeUserDataFinishError: false,
    userDataChanged: false,
    changeUserPassword: "",
    sentLostPassword: "",
    setSearchName: "",
    followedEntities: [],
    savedSearchData: [],
    followed: false,
    verifiedEmail: "",
    userPasswordToken: "",
    statistics: [],
    error: null,
    site_type: null,
    exportData: []
};

export default function reducer(state = initialState, action) {
    //console.log(action);
    switch (action.type) {
        case SEARCH_AUTOCOMPLETE:
            if (action.text !== undefined && action.text.length >= 2) {
                fetch(default_url + "/search/entities/autocomplete/" + action.text + "/0/10/?format=json",
                    {method:'GET', headers: headers
                }).then(function (response) {
                    return response.json()
                }).then(function (json) {
                    store.dispatch(updateAutocompleteState(json.results));

                }).catch(function (ex) {
                    console.log(ex)
                });
                return state;
            }
            return Object.assign({}, state, {
                autocompleteList: initialState.autocompleteList
            });
        case UPDATE_AUTOCOMPLETE_STATE:
            return Object.assign({}, state, {
                autocompleteList: action.results
            });
        /*case SEARCH_STATE:
            if (action.text !== undefined && action.text.length >= 2) {
                //console.log(default_url + '/search/' + action.text + '/0/10' + '?format=json');
                console.log("SEARCH_STATE reducer text: ",action.text);
                console.log("SEARCH_STATE reducer limit: ",action.limit);
                console.log("SEARCH_STATE reducer offset: ",action.offset);
                fetch(default_url + "/search/search/" + action.text + "/0/10?format=json",
                    {method:'GET', headers: headers
                    }).then(function (response) {
                    return response.json()
                }).then(function (json) {
                    console.log("json search state: ",json);
                    store.dispatch(searchState(json.results));

                }).catch(function (ex) {
                    console.log(ex)
                });
                return state;
            }
            return Object.assign({}, state, {
                searchList: action.searchList,
                searchListTotal: action.total,
            });*/
        case UPDATE_SEARCH_STATE:
            return Object.assign({}, state, {
                searchList: action.results.results !== undefined && action.results.results,
                searchListTotal: action.results.total !== undefined && action.results.total,
                autocompleteList: [],
            });
        case UPDATE_ENTITY_DATA:
            let followed = false;
            if (action.followed !== undefined && action.followed !== null && action.followed.detail === undefined) {
                followed = true
            }
            return Object.assign({}, state, {
                autocompleteList: [],
                entityData: action.result,
                entityAttributes: action.attributes,
                entityEntityConnectionsData: [],
                entityConnectionsByYearData: action.results,
                followed: followed,
                error: null,
                site_type: null
                //entity_a: action.result.public_id
            });
        case DELETE_ENTITY_DATA:
            return Object.assign({}, state, {
                autocompleteList: [],
                entityData: [],
                entityAttributes: [],
                //entity_a: action.result.public_id
            });
        case UPDATE_CONNECTION_DATA:
            let tmp_connData = [];
            action.results.results.map((item) => {
                let attribute = {};
                if( action.result.result !== undefined && action.result.result[item.string_id] !== undefined) {
                    attribute.name = item.name;
                    attribute.order_number = item.order_number;
                    attribute.collection = item.collection;
                    attribute.string_id = item.string_id;
                    attribute.attribute_type = item.attribute_type;
                    if(action.result.result[item.string_id] !== undefined && action.result.result[item.string_id] !== null && action.result.result[item.string_id][0] !== undefined && action.result.result[item.string_id][0].value !== undefined) {
                        attribute.value = action.result.result[item.string_id][0].value;
                        attribute.collections = action.result.result[item.string_id][0].collections;
                        if(action.result.result[item.string_id][0].currency !== undefined) {
                            attribute.currency = action.result.result[item.string_id][0].currency;
                        }
                    }
                    else if(action.result.result[item.string_id][0] !== undefined) {
                        attribute.attributes = [];
                        let sub_attribute = {};
                        item.attributes.map((attribute) => {
                            if(action.result.result[item.string_id][0][attribute.string_id] !== undefined) {
                                sub_attribute.name = attribute.name;
                                sub_attribute.order_number = attribute.order_number;
                                sub_attribute.collection = attribute.collection;
                                sub_attribute.string_id = attribute.string_id;
                                sub_attribute.attribute_type = attribute.attribute_type;
                                if(action.result.result[item.string_id][0][attribute.string_id][0] !== undefined &&
                                    action.result.result[item.string_id][0][attribute.string_id][0].value !== undefined ) {
                                    sub_attribute.value = action.result.result[item.string_id][0][attribute.string_id][0].value;
                                    sub_attribute.collections = action.result.result[item.string_id][0][attribute.string_id][0].collections;
                                    if(action.result.result[item.string_id][0][attribute.string_id][0].currency !== undefined) {
                                        sub_attribute.currency = action.result.result[item.string_id][0][attribute.string_id][0].currency;
                                    }
                                }
                                else if(action.result.result[item.string_id][0][attribute.string_id][0] !== undefined) {
                                    sub_attribute.attributes = [];
                                    let sub_sub_attribute = {};
                                    attribute.attributes.map((subAttribute) => {
                                        if(action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id] !== undefined) {
                                            sub_sub_attribute.name = subAttribute.name;
                                            sub_sub_attribute.order_number = subAttribute.order_number;
                                            sub_sub_attribute.collection = subAttribute.collection;
                                            sub_sub_attribute.string_id = subAttribute.string_id;
                                            sub_sub_attribute.attribute_type = subAttribute.attribute_type;
                                            if(action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id][0] !== undefined &&
                                                action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id][0].value !== undefined) {
                                                sub_sub_attribute.value = action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id][0].value;
                                                sub_sub_attribute.collections = action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id][0].collections;
                                                if(action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id][0].currency !== undefined) {
                                                    sub_sub_attribute.currency = action.result.result[item.string_id][0][attribute.string_id][0][subAttribute.string_id][0].currency;
                                                }
                                            }
                                            else {
                                                console.log("šta je ovo?!")
                                            }
                                        }
                                        return null;
                                    });
                                    sub_attribute.attributes.push(sub_sub_attribute);
                                }
                            }
                            return null;
                        });
                        attribute.attributes.push(sub_attribute);
                    }
                    tmp_connData.push(attribute);
                }
                return null;
            });
            if(action.result.result !== undefined) action.result.result.attributes = tmp_connData;
            return Object.assign({}, state, {
                connectionData: action.result.result,
                entityData: [],
                error: null,
                site_type: null
            });
        case DELETE_CONNECTION_DATA:
            return Object.assign({}, state, {
                connectionData: [],
                entityEntityConnectionsData: [],
                entityData: []
            });
        case UPDATE_CONNECTION_RELATED_CONNECTIONS_DATA:
            return Object.assign({}, state, {
                relatedConnectionsData: action.results
            });
        case SET_ENTITY_FOR_RELATED_CONNECTIONS_DATA:
            return Object.assign({}, state, {
                entity_a: action.text
            });
        case UPDATE_ATTRIBUTE_DATA:
            var tmp = Object.assign([], state.attributeData, {});
            tmp[action.result.string_id] = action.result;
            return Object.assign({}, state, {
                attributeData: tmp
            });
        case UPDATE_ENTITY_CONNECTIONS_DATA:
            return Object.assign({}, state, {
                connectionsData: action.results,
            });
        case UPDATE_ENTITY_ENTITY_CONNECTIONS_DATA:
            return Object.assign({}, state, {
                entityEntityConnectionsData: action.results,
            });
        case UPDATE_ENTITY_RELATED_ENTITIES_DATA:
            return Object.assign({}, state, {
                relatedEntitiesData: action
            });
        case SET_CONNECTION_TYPE_CATEGORIES_DATA:
            var tmpData = [];
            const categories = action.categories.results;
            for(let i = 0; i < categories.length; i++) {
                let obj = {
                    value: categories[i].string_id,
                    label: categories[i].name
                };
                let tmp_children = [];
                if(action.types[categories[i].string_id] !== undefined){
                    for(let j = 0; j < action.types[categories[i].string_id].length; j++) {
                        let obj2 = {
                            value: action.types[categories[i].string_id][j].string_id,
                            label: action.types[categories[i].string_id][j].name
                        };
                        tmp_children.push(obj2);
                    }
                }
                obj.children = tmp_children;
                tmpData.push(obj);
            }
            var set_connection_array = [];
            var set_entity_array = [];
            var is_pep = [];
            if (action.search.substr(0, 1) === "?") {
                action.search = action.search.substr(1);
            }
            let tmp_array = action.search.split("&"); //url query string
            tmp_array.map((item, index) => {
                if (item.split("=")[0] === "connection_type") {
                    set_connection_array.push(item.split("=")[1]);
                }
                if (item.split("=")[0] === "entity_type") {
                    set_entity_array.push(item.split("=")[1]);
                }
                if (item.split("=")[0] === "is_pep" && item.split("=")[1] === "true") {
                    is_pep = "true";
                }
                return "";
            });
            return Object.assign({}, state, {
                connectionsTypeCategoryData: tmpData,//conn type categories with name and children
                connectionsTypeCategoryChecked: set_connection_array,
                entityTypeCategoryChecked: set_entity_array,
                isPepChecked: is_pep
            });
        case UPDATE_CONNECTION_TYPE_CATEGORIES_DATA:
            var connection_array = [];
            var entity_array = [];
            //var is_pep = [];
            if(action.search !== undefined) {
                if (action.search.substr(0, 1) === "?") {
                    action.search = action.search.substr(1);
                }
                let tmp_array = action.search.split("&"); //url query string
                tmp_array.map((item, index) => {
                    if (item.split("=")[0] === "connection_type") {
                        connection_array.push(item.split("=")[1]);
                    }
                    if (item.split("=")[0] === "entity_type") {
                        entity_array.push(item.split("=")[1]);
                    }
                    /*if (item.split("=")[0] === "is_pep" && item.split("=")[1] === "true") {
                        is_pep = "true";
                    }*/
                    return "";
                });
            }
            if(connection_array.length === 0) {
                connection_array = store.getState().rootReducer.reducer.connectionsTypeCategoryChecked;
            }
            if(entity_array.length === 0) {
                entity_array = store.getState().rootReducer.reducer.entityTypeCategoryChecked;
            }
            return Object.assign({}, state, {
                connectionsTypeCategoryChecked: connection_array,
                entityTypeCategoryChecked: entity_array,
                isPepChecked: null
            });
        case UPDATE_CONNECTION_TYPE_AUTOCOMPLETE_DATA:
            let tmpAutocomplete = action.category.results;
            let tmpAutoRes = [];
            for(let i = 0; i < tmpAutocomplete.length; i++) {
                let obj = {
                    value: tmpAutocomplete[i].string_id,
                    label: tmpAutocomplete[i].name
                };
                tmpAutoRes.push(obj);
            }
            return Object.assign({}, state, {
                connectionsTypeAutocompleteData: {
                    results : tmpAutoRes,
                    total: action.category.total
                }
            });
        case UPDATE_LEGAL_ENTITY_TYPES_DATA:
            let tmpEntityTypes = action.results;
            let tmpLegalTypes = action.legal.results;
            let tmpTypes = [];
            for(let i = 0; i < tmpEntityTypes.length; i++) {
                let obj = {
                    value: tmpEntityTypes[i].string_id,
                    label: tmpEntityTypes[i].name
                };
                if(tmpEntityTypes[i].string_id === "legal_entity") {
                    let tmp_children = [];
                    if(tmpLegalTypes !== undefined && tmpLegalTypes !== null) {
                        for(let j = 0; j < tmpLegalTypes.length; j++) {
                            let obj2 = {
                                value: tmpLegalTypes[j].string_id,
                                label: tmpLegalTypes[j].name
                            };
                            tmp_children.push(obj2);
                        }
                    }
                    obj.children = tmp_children;
                }
                tmpTypes.push(obj);
            }
            return Object.assign({}, state, {
                entityTypesData: tmpTypes,
                entityTypesLegalDataTotal: action.legal.total
            });
        case UPDATE_FILTER_CONNECTIONS_DATA:
            var nodes = [];
            var edges = [];
            if(action.term !== "") {
                action.results.results.map((result, index) => {
                    var name_a = result[0].name;
                    var full_name_a = result[0].name;
                    if (name_a.trim() === "") {
                        name_a = "...";
                        full_name_a = "..."
                    } else if (name_a.length > 20) {
                        name_a = name_a.substr(0, 19);
                        name_a = name_a.substr(0, name_a.lastIndexOf(" "));
                    }
                    var name_b = result[1].name;
                    var full_name_b = result[1].name;
                    if (name_b.trim() === "") {
                        name_b = "...";
                        full_name_b = "..."
                    } else if (name_b.length > 20) {
                        name_b = name_b.substr(0, 19);
                        name_b = name_b.substr(0, name_b.lastIndexOf(" "));
                    }
                    let value = null;
                    if (result[3] !== undefined) {
                        value = result[3];
                    }
                    let image_a = company_default;
                    let image_b = company_default;
                    if (result[0].entity_type_string_id === "person") {
                        image_a = person_default;
                        if (result[0].is_pep !== null && result[0].is_pep) {
                            image_a = person_pep;
                        }
                        if (result[0].public_id === action.term) {
                            image_a = person_active;
                        }
                    } else if (result[0].entity_type_string_id === "real_estate") {
                        image_a = home_default;
                        if (result[0].is_pep !== null && result[0].is_pep) {
                            image_a = home_pep;
                        }
                        if (result[0].public_id === action.term) {
                            image_a = home_active;
                        }
                    }  else if (result[0].entity_type_string_id === "savings") {
                        image_a = piggyBank_default;
                        if (result[0].is_pep !== null && result[0].is_pep) {
                            image_a = piggyBank_pep;
                        }
                        if (result[0].public_id === action.term) {
                            image_a = piggyBank_active;
                        }
                    } else if (result[0].entity_type_string_id === "movable") {
                        image_a = car_default;
                        if (result[0].is_pep !== null && result[0].is_pep) {
                            image_a = car_pep;
                        }
                        if (result[0].public_id === action.term) {
                            image_a = car_active;
                        }
                    } else {
                        if (result[0].is_pep !== null && result[0].is_pep) {
                            image_a = company_pep;
                        }
                        if (result[0].public_id === action.term) {
                            image_a = company_active;
                        }
                    }
                    if (result[1].entity_type_string_id === "person") {
                        image_b = person_default;
                        if (result[1].is_pep !== null && result[1].is_pep) {
                            image_b = person_pep;
                        }
                        if (result[1].public_id === action.term) {
                            image_b = person_active;
                        }
                    } else if (result[1].entity_type_string_id === "real_estate") {
                        image_b = home_default;
                        if (result[1].is_pep !== null && result[1].is_pep) {
                            image_b = home_pep;
                        }
                        if (result[1].public_id === action.term) {
                            image_b = home_active;
                        }
                    } else if (result[1].entity_type_string_id === "savings") {
                        image_b = piggyBank_default;
                        if (result[1].is_pep !== null && result[1].is_pep) {
                            image_b = piggyBank_pep;
                        }
                        if (result[1].public_id === action.term) {
                            image_b = piggyBank_active;
                        }
                    } else if (result[1].entity_type_string_id === "movable") {
                        image_b = car_default;
                        if (result[1].is_pep !== null && result[1].is_pep) {
                            image_b = car_pep;
                        }
                        if (result[1].public_id === action.term) {
                            image_b = car_active;
                        }
                    }
                    else {
                        if (result[1].is_pep !== null && result[1].is_pep) {
                            image_b = car_pep;
                        }
                        if (result[1].public_id === action.term) {
                            image_b = company_active;
                        }
                    }
                    nodes[result[0].public_id] = {
                        id: result[0].public_id,
                        label: name_a,
                        image: image_a,
                        title: "<b>" + ENTITY + ": </b>" + result[0].name + "<span> " + VIZUALIZATION_TOOLTIP_ENTITY + "</span>"
                        //shape: 'dot',
                        /*icon: {
                            code: icon_a,
                            color: color_a
                        }/*,
                        color: {
                            border: color_a
                        }*/
                    };
                    nodes[result[1].public_id] = {
                        id: result[1].public_id,
                        label: name_b,
                        image: image_b,
                        title: "<b>" + ENTITY + ":</b> " + result[1].name + "<span> " + VIZUALIZATION_TOOLTIP_ENTITY + "</span>"
                        /*icon: {
                            code: icon_b,
                            color: color_b
                        }/*,
                        color: {
                            border: color_a
                        }*/
                    };
                    let edgeColor = "grey";

                    if (result[2].length === 1) {
                        if(result[2][0] === "politicka") {
                            edgeColor = "#3cadff";
                        }
                        if (result[2][0] === "imovinsko_pravna") {
                            edgeColor = "#ff5b3c";
                        }
                        if (result[2][0] === "poslovna") {
                            edgeColor = "#9f6eff";
                        }
                        if (result[2][0] === "obiteljska") {
                            edgeColor = "#2be84e";
                        }
                        if (result[2][0] === "interesna") {
                            edgeColor = "#ffeb30";
                        }
                    }
                    let title = "<b>" + CONNECTIONS + "</b>: </br>" + full_name_a + " " + AND + " " + full_name_b + "<span> " + VIZUALIZATION_TOOLTIP_CONN + "</span>";
                    if (value === 1) {
                        title = "<b>" + CONNECTION + " </b>: </br>" + full_name_a + " " + AND + " " + full_name_b + "<span> " + VIZUALIZATION_TOOLTIP_CONN + "</span>";
                    }
                    if (edges[result[0].public_id + '__' + result[1].public_id] !== undefined &&
                        edges[result[0].public_id + '__' + result[1].public_id].color.color !== edgeColor) {
                        edges[result[0].public_id + '__' + result[1].public_id] = {
                            id: result[0].public_id + '__' + result[1].public_id,
                            from: result[0].public_id,
                            to: result[1].public_id,
                            color: {
                                color: "grey"
                            },
                            smooth: {
                                type: "horizontal",
                                forceDirection: "none",
                                roundness: 0.5
                            },
                            label: value,//result.connection_type_category.name.substring(0, 3).toUpperCase(),
                            title: title
                        };
                    } else {
                        edges[result[0].public_id + '__' + result[1].public_id] = {
                            id: result[0].public_id + '__' + result[1].public_id,
                            from: result[0].public_id,
                            to: result[1].public_id,
                            color: {
                                color: edgeColor
                            },
                            smooth: {
                                type: "horizontal",
                                forceDirection: "none",
                                roundness: 0.5
                            },
                            label: value,//result.connection_type_category.name.substring(0, 3).toUpperCase(),
                            title: title
                        };
                    }
                    return "";
                });
                var nodes2 = [];
                var edges2 = [];
                for (var key in nodes) {
                    nodes2.push(nodes[key]);
                }
                for (var key2 in edges) {
                    edges2.push(edges[key2]);
                }
                return Object.assign({}, state, {
                    graph: {
                        nodes: nodes2,
                        edges: edges2
                    },
                    graphTotal: action.results.total
                });
            }
            else {
                return Object.assign({}, state, {
                    filterConnections: action.results
                });
            }
        case DELETE_FILTER_CONNECTIONS_DATA:
            return Object.assign({}, state, {
                graph: {
                    nodes: [],
                    edges: []
                },
                graphTotal: 0,
                filterConnections: []
            });
        case UPDATE_FILTER_DATE_FROM:
            return Object.assign({}, state, {
                filterDateFrom: action.result
            });
        case UPDATE_FILTER_DATE_TO:
            return Object.assign({}, state, {
                filterDateTo: action.result
            });
        case UPDATE_CONNECTION_TYPE_CATEGORIES_FOR_ENTITY_DATA:
            return Object.assign({}, state, {
                connectionsTypeCategoryData: action.results
            });
        case UPDATE_ENTITY_LOG_DATA:
            return Object.assign({}, state, {
                entityLogAttr: action.results
            });
        case UPDATE_CONNECTION_LOG_DATA:
            return Object.assign({}, state, {
                connectionLogAttr: action.results
            });
        case UPDATE_ARTICLE:
            return Object.assign({}, state, {
                article: action.result,
                error: null,
                site_type: null
            });
        case UPDATE_ARTICLE_SHORT:
            return Object.assign({}, state, {
                articleShort: action.result
            });
        case UPDATE_SOURCES:
            return Object.assign({}, state, {
                sources: action.results
            });

        /********USER STUFF: ********/
        case UPDATE_ACTIVE_USER:
            if(action.error !== undefined) {
                let tmp = action.error;
                tmp.site = action.login;
                return Object.assign({}, state, {
                    activeUserError: tmp
                });
            }
            else {
                return Object.assign({}, state, {
                    activeUser: action,
                    activeUserError: []
                });
            }
        case UPDATE_CHANGE_PASSWORD_DATA:
            return Object.assign({}, state, {
                changePassword: action.result
            });
        case UPDATE_CHANGE_USER_DATA:
            return Object.assign({}, state, {
                changeUserData: action.error !== "error" ? action.result : null,
                changeUserDataErrors: action.error === "error" ? action.result : null,
                changeUserDataFinish: true,
                changeUserDataFinishError: action.error === "error" ? true : false,
                userDataChanged: action.change === "change" ? true : false
            });
        case UPDATE_CHANGE_USER_PASSWORD_DATA:
            return Object.assign({}, state, {
                changeUserPassword: action.result
            });
        case UPDATE_IS_ENTITY_FOLLOWED_DATA:
            return Object.assign({}, state, {
                followed: action.result
            });
        case SEND_LOST_PASSWORD_DATA:
            return Object.assign({}, state, {
                sentLostPassword: action
            });
        case SET_SEARCH_NAME_DATA:
            if(action.error !== undefined) {
                return Object.assign({}, state, {
                    setSearchName: action.error
                });
            }
            else {
                return Object.assign({}, state, {
                    setSearchName: action.result
                });
            }
        case UPDATE_FOLLOWED_ENTITIES_DATA:
            return Object.assign({}, state, {
                followedEntities: action.results,
            });
        case SET_VERIFY_MAIL_DATA:
            //if(action.error !== undefined) {
                return Object.assign({}, state, {
                    verifiedEmail: action,
                });
            /*}
            else {
                return Object.assign({}, state, {
                    verifiedEmail: action.result,
                });
            }*/
        case SET_USER_PASSWORD_TOKEN_DATA:
            return Object.assign({}, state, {
                userPasswordToken: action,
            });

        case UPDATE_STATISTICS_DATA:
            return Object.assign({}, state, {
            statistics: action.result,
            });


        case UPDATE_SAVED_SEARCHES_DATA:
            return Object.assign({}, state, {
                savedSearchData: action.results
            });

        case ADD_ERROR:
            return Object.assign({}, state, {
                error: action.error,
                site_type: action.site_type
            });

        case REMOVE_ERROR:
            return Object.assign({}, state, {
                error: null,
                site_type: null
            });

        case UPDATE_EXPORT_DATA:
            return Object.assign({}, state, {
                exportData: action.results
            });

        default:
            return state;
    }
}
