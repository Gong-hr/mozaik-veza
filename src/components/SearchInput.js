import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import {store} from "../index"
import {searchAutocomplete} from '../actions'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {SEARCH_PLACEHOLDER} from "../lang"

class SearchInput extends Component {

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
                //this.setInputValue('');
                //this.handleSearch(this.getInputValue());
                store.dispatch(searchAutocomplete(''));
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
        this.props.onSubmit(this.getInputValue())
    };

    render() {
        return (
            <div className="search-div">
                <form onSubmit={e => {
                    e.preventDefault();
                    if (!this.getInputValue().trim()) {
                        return
                    }
                    this.handleSearch(this.getInputValue());
                    this.setInputValue('');
                }}>
                    <input ref={(input) => this.input = input}
                           onChange={e => store.dispatch(searchAutocomplete(e.target.value))}
                           className="search-input"
                           type="search"
                           placeholder={SEARCH_PLACEHOLDER}/>

                    <button type={"submit"} className="search-button"><FontAwesomeIcon
                        icon="search"/></button>
                </form>
            </div>
        )
    }
}

export default SearchInput;
/*
class SearchInput extends Component {
    constructor() {
        super();
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            inputValue: ''
        };
    }

    static contextTypes = {
        router: PropTypes.object
    };
    handleAutocomplete = (e) => {
        //console.log("sended", e.target.value);
        this.updateInputValue(e);
        //console.log(this.state.inputValue);
        store.dispatch(searchAutocomplete(e.target.value));
    };
    handleSearch = () => {
        this.context.router.history.push("/search/" + this.state.inputValue + "/0/20?format=json");
    };
    updateInputValue = (e) => {
        this.setState({
            inputValue: e.target.value
        });
    };

    render() {
        return (
            <div className="search-div">
                <Form>
                    <FormGroup>
                        <Input onChange={e => this.handleAutocomplete(e)} className="search-input" ref="search"
                               type="search" value={this.state.inputValue}
                               placeholder="Pretraži fizičke i pravne osobe"/>
                        <Button type={"submit"} onClick={this.handleSearch} className="search-button"><FontAwesomeIcon
                            icon="search"/></Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

SearchInput = connect()(SearchInput);
export default SearchInput;*/