import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import {store} from "../index"
import {searchAutocomplete} from '../actions'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class SearchInputHeader extends Component {

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }

    handleClickOutside(event) {
        try {
            const domNode = ReactDOM.findDOMNode(this);
            if (!domNode || !domNode.contains(event.target)) {
                store.dispatch(searchAutocomplete(''));
                /*if(!document.getElementById('SearchForm').classList.contains("displayNone")) {
                    document.getElementById('SearchForm').classList.add("displayNone");
                }*/
            }
            else {
                store.dispatch(searchAutocomplete(event.target.value));
            }
        }
        catch(e){
            //console.log('error', e);
        }

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            //this.setInputValue(nextProps.value)
        }
    }

    getInputValue = () => {
        return this.input.value
    };

    setInputValue = (val) => {
        this.input.value = val
    };

    handleSearch = (e) => {
        if(!document.getElementById('SearchForm').classList.contains("displayNone")) {
            document.getElementById('SearchForm').classList.add("displayNone");
        }
        this.props.onSubmit(this.getInputValue())
    };

    showSearch = () => {
        document.getElementById('SearchForm').classList.toggle("displayNone")
    };

    render() {
        return (
            <div className="search-header-div Search-Field-sm-header">
                <form id={"SearchForm"} className={"displayNone"} onSubmit={e => {
                    e.preventDefault();
                    if (!this.getInputValue().trim()) {
                        return
                    }
                    this.handleSearch(this.getInputValue());
                    this.setInputValue('');
                }}>
                    <input ref={(input) => this.input = input}
                           onChange={e => store.dispatch(searchAutocomplete(e.target.value))}
                           className="search-header-input"
                           type="search"
                           placeholder={""}/>
                    <button type={"submit"} className="search-header-button search-header-button-submit">
                        <FontAwesomeIcon icon="search"/>
                    </button>
                    <span className={"font-awesome-holder"} onClick={this.showSearch}><FontAwesomeIcon icon="times"/></span>
                </form>
                <button onClick={this.showSearch} className="search-header-button">
                    <FontAwesomeIcon icon="search"/>
                </button>
            </div>
        )
    }
}
