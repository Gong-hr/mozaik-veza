import React, {Component} from 'react'
//import SearchAutocompleteItem from './SearchAutocompleteItem'
import { Link } from 'react-router-dom'
import {LEGAL_ENTITY, PERSON} from "../lang";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class SearchAutocompleteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            array: []
        };
    }
    tmp_array = [];

    componentDidMount() {
        this.setState({
            //array: this.props.results.results
        });
        /*this.unsubscribe = store.subscribe(() => {
            this.setState({
                array: store.getState().rootReducer.reducer.autocompleteList
            })
        });*/
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let person = "";
        let legal = "";
        if(this.props.results !== undefined && this.props.results.results !== undefined) {
            this.tmp_array = this.props.results.results.map((result, index) => {
                return <li key={result.public_id} >
                    <Link to={'/entity/' + result.public_id}>
                        {result.entity_type.string_id === "person" ? person = true : person = false}
                        {result.entity_type.string_id === "legal_entity" ? legal = true : legal = false}
                        <div className={result.is_pep ? "pep" : ""}><FontAwesomeIcon
                            icon={person ? "male" : "building"}/></div>
                        <div className={"Search-name"}>
                            {
                                person ?
                                    result.person_first_name !== undefined &&
                                    result.person_first_name.map((first_name) => {
                                        return first_name.value + " "
                                    })
                                    : ""
                            }
                            {
                                result.person_last_name !== undefined &&
                                result.person_last_name.map((last_name, index) => {
                                    return last_name.value + " "
                                })
                            }
                            {
                                legal ?
                                    result.legal_entity_name !== undefined &&
                                    result.legal_entity_name.map((name, index) => {
                                        return name.value + " "
                                    })
                                    : ""
                            }
                        </div>
                        <div className={"Autocomplete-personType"}>
                            {person
                                ?
                                result.entity_type.name === "Person" ? PERSON : result.entity_type.name
                                :
                                result.entity_type.name === "Legal Entity" ? LEGAL_ENTITY : result.entity_type.name}
                        </div>
                    </Link>
                </li>
            });

            if(prevProps.results.results !== this.props.results.results) {
                this.setState({
                    array: this.tmp_array
                })
            }
        }
    }

    render() {
        return (
            <ul style={{display: this.props.results !== undefined && this.props.results.results !== undefined && this.props.results.results.length < 1 ? "none" : "block"}}>
                {this.tmp_array}
            </ul>
        )
    }
}
/*const SearchAutocompleteList = (results) => (

);*/



/*<SearchAutocompleteItem key={index} {...result} params={results.params}/>*/

//withRouter(SearchAutocompleteList);