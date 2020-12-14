import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {store} from "../index"
import {filterConnectionTypesAutocomplete} from "../actions"
import {CLOSE, TOO_MANY_CONNECTIONS, START_SEARCH, MORE} from "../lang"
import {number_per_page_by_db} from "../config"

export default class FilterEntityCheckboxTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigate: false,
            checkedChildren: [],
            checkedParents: [],
            expanded: [],
            str: "",
            showChildren: false,
            showingChildrenOf: null,
            filteredChildren: null,
            test: "da",
            semiChecked: [],
            arrayAjax: [],
            more: false
        };
    }
    componentDidMount() {
        let tmp = this.props.location.search;
        if(tmp !== "") {
            if(tmp.substr(0,1) === "?") {
                tmp = tmp.substr(1);
            }
            let tmp_array = tmp.split("&");
            let checked_parents = [];
            let checked_children = [];
            tmp_array.map((item, index) => {
                if(item.split("=")[0] === "entity_type" || item.split("=")[0] === "connection_type_category"){
                    //checked_entites.push(item.split("=")[1]);
                    checked_parents.push(item.split("=")[1]);
                }
                else if(item.split("=")[0] === "legal_entity_type" || item.split("=")[0] === "connection_type"){
                    checked_children.push(item.split("=")[1]);
                }
                return "";
            });
            this.setState({
                checkedParents: checked_parents,
                checkedChildren: checked_children
            })
        }

    }

    handleOpenChildren(e) {
        if(this.props.openedChildren !== "" && this.props.openedChildren !== false && this.props.checkboxesGroupName !== this.props.openedChildren) {
            //this.props.setCloseChildren(this.props.checkboxesGroupName)
        }
        if(this.state.showChildren || this.props.openedChildren === this.props.checkboxesGroupName) {
            this.closeChildren();
        }
        else {
            this.props.setOpenedChildren(this.props.checkboxesGroupName);
        }
        let index = "";
        if( e !== undefined) index = e.target.getAttribute('name');
        else index = this.state.showingChildrenOf.value;
        let found = null;
        if(index !== null) {
            if (this.state.showingChildrenOf === null || this.state.showingChildrenOf.value !== index) {
                found = this.props.params.find(function (element) {
                    if (element.value === index) {
                        return element
                    }
                    else {
                        return null
                    }
                });
                if (found !== undefined && found !== null) {
                    let tmp = found.value + "div";
                    document.getElementById(tmp).classList.add("whiteBackground");
                    this.setState({
                        showingChildrenOf: found,
                        showChildren: true
                    });
                }
            }
            else {
                this.setState({
                    showingChildrenOf: null,
                    showChildren: false
                });
            }
        }
    }

    handleChildrenChecked(e) {
        let tmp_array_checked = [];
        let tmp_array_for_ajax = [];
        let tmp_parent_array = [];
        let tmp_semi_checked = [];
        this.state.semiChecked.map((item) => {
            tmp_semi_checked.push(item);
            return null;
        });
        this.state.checkedParents.map((item) => {
            tmp_parent_array.push(item);
            return null;
        });
        tmp_array_checked = this.state.checkedChildren;
        tmp_array_for_ajax = this.state.arrayAjax;
        let all_in_tmp_array_1 = true;
        let some_in_tmp_array_1 = false;
        if (this.state.showingChildrenOf.children.length === 0) {
            all_in_tmp_array_1 = false;
        }
        const item = e.target.name;
        const parent = this.state.showingChildrenOf.value;
        if(e.target.checked) {
            tmp_array_checked[item+parent] = {child: item, parent: parent};
            tmp_array_for_ajax[item+parent] = {child: item, parent: parent};
            this.state.showingChildrenOf.children.map((item) => {
                if(tmp_array_checked[item.value+parent] === undefined){
                    if(this.state.showingChildrenOf.children.length > 1) {
                        all_in_tmp_array_1 = false;

                    }
                }
                else {
                    some_in_tmp_array_1 = true;
                }
                return null;
            });
            if(all_in_tmp_array_1) {
                some_in_tmp_array_1 = false;
            }
            if (this.state.showingChildrenOf.children.length === 0) {
                some_in_tmp_array_1 = true;
            }
            if(all_in_tmp_array_1 && !tmp_parent_array.includes(this.state.showingChildrenOf.value)) {
                this.state.showingChildrenOf.children.map((item) => { //remove all children from tmp_array_for_ajax...
                    if(tmp_array_for_ajax[item.value+parent] !== undefined){
                        delete tmp_array_for_ajax[item.value+parent];
                        delete tmp_array_checked[item.value+parent];
                    }
                    return null;
                });
                //tmp_array_checked[parent+parent] = {child: parent, parent: parent};//...and add parent
                tmp_parent_array.push(this.state.showingChildrenOf.value);//...and add parent
                tmp_array_for_ajax[parent+parent] = {child: parent, parent: parent};
                //if adding parent to ajax, remove just added child:
                delete tmp_array_for_ajax[item+parent];

            }
            if(tmp_semi_checked.indexOf(this.state.showingChildrenOf.value) < 0 && some_in_tmp_array_1) { //not semichecked but should be
                tmp_semi_checked.push(this.state.showingChildrenOf.value);
            }
            else if(all_in_tmp_array_1 && tmp_semi_checked.indexOf(this.state.showingChildrenOf.value) > -1){ //remove from semichecked
                tmp_semi_checked.splice(tmp_semi_checked.indexOf(this.state.showingChildrenOf.value), 1);
            }
        }
        else { //unchecked
            if(tmp_array_checked[item+parent] !== undefined) {//in children
                let tmp_string = item+parent;
                delete tmp_array_checked[item + parent];
                delete tmp_array_for_ajax[tmp_string];
                let checked = Object.keys(tmp_array_checked).map(function(key) {
                    return tmp_array_checked[key];
                });
                let new_checked = checked.filter(item => item.parent === parent);
                if(new_checked.length < 1 && this.state.semiChecked.includes(parent))  {
                    tmp_semi_checked.splice(tmp_semi_checked.indexOf(parent), 1);
                }
                else if(tmp_parent_array.includes(parent)) {
                    tmp_parent_array.splice(tmp_parent_array.indexOf(parent), 1);
                    delete tmp_array_checked[parent+parent];
                    delete tmp_array_for_ajax[parent+parent];
                    this.state.showingChildrenOf.children.map(i => {
                        if(i !== item) {
                            tmp_array_for_ajax[i.value + parent] = {child: i.value, parent: parent};
                        }
                        return null;
                    });
                    tmp_semi_checked.push(parent);
                }
            }
            else {//not in children, parent from parents to semi, rest of children to children & ajax
                if(tmp_parent_array.includes(parent)) {
                    tmp_parent_array.splice(tmp_parent_array.indexOf(parent), 1);
                    delete tmp_array_for_ajax[parent+parent];
                    delete tmp_array_checked[parent+parent];
                    let thereAreOtherChildren = false;
                    this.state.showingChildrenOf.children.map((i) => {
                        if(i.value !== item) {
                            tmp_array_checked[i.value + parent] = {child: i.value, parent: parent};
                            tmp_array_for_ajax[i.value + parent] = {child: i.value, parent: parent}
                            thereAreOtherChildren = true;
                        }
                        return null
                    });
                    thereAreOtherChildren && tmp_semi_checked.push(parent);//put in semi only if it there are some other children
                }
            }

        }
        this.setState({
            checkedChildren: tmp_array_checked,
            checkedParents: tmp_parent_array,
            semiChecked: tmp_semi_checked,
            arrayAjax: tmp_array_for_ajax,
            navigate: true,
        });
        this.props.setParentState(tmp_parent_array, tmp_array_checked, tmp_array_for_ajax, tmp_semi_checked);
    }

    handleChecked(e) {
        let tmp_parent_array = [];
        let tmp_semi_checked = [];
        this.state.checkedParents.map((item) => {
            tmp_parent_array.push(item);
            return null;
        });
        let tmp_array_for_ajax = this.state.arrayAjax;
        let tmp_children_checked = this.state.checkedChildren;
        this.state.semiChecked.map((item) => {
            tmp_semi_checked.push(item);
            return null;
        });
        let semi_index = -1;
        if(e.target.name.length > 0) {
            semi_index = tmp_semi_checked.indexOf(e.target.name);
        }
        if(semi_index > -1) {
            tmp_semi_checked.splice(tmp_semi_checked.indexOf(e.target.name), 1);
        }
        let index = -1;
        if(e.target.name.length > 0 /*&& !e.target.checked*/) {
            index = this.state.checkedParents.indexOf(e.target.name);
        }
        if(index < 0 && e.target.checked){
            //remove children from children:
            let children = Object.keys(tmp_children_checked).map((key) => { //tmp_array_for_ajax to array
                return tmp_children_checked[key];
            });
            let new_children = children.filter(item => item.parent !== e.target.name);//filter array
            tmp_children_checked = [];
            new_children.map((item) => {//back to object
                tmp_children_checked[item.child + item.parent] = {child: item.child, parent: item.parent}
                return null;
            });
            // remove children from ajax before adding parent ot ajax:
            let ajax = Object.keys(tmp_array_for_ajax).map((key) => { //tmp_array_for_ajax to array
                return tmp_array_for_ajax[key];
            });
            let new_ajax = ajax.filter(item => item.parent !== e.target.name);//filter array
            tmp_array_for_ajax = [];
            new_ajax.map((item) => {//back to object
                tmp_array_for_ajax[item.child + item.parent] = {child: item.child, parent: item.parent}
                return null;
            });

            tmp_parent_array.push(e.target.name);//parent is checked, add to parent
            tmp_array_for_ajax[e.target.name + e.target.name] = {child: e.target.name, parent: e.target.name};//add parent to ajax
        }
        else { //not in parents or unchecked or both
            tmp_parent_array.splice(index, 1);
            delete tmp_array_for_ajax[e.target.name + e.target.name];
        }
        this.setState({
            checkedParents: tmp_parent_array,
            checkedChildren: tmp_children_checked,
            arrayAjax: tmp_array_for_ajax,
            navigate: true,
            semiChecked: tmp_semi_checked
        });
        this.props.setParentState(tmp_parent_array, tmp_children_checked, tmp_array_for_ajax, this.state.semiChecked);
    }

    closeChildren() {
        this.props.setOpenedChildren(false);
        let tmp = this.state.showingChildrenOf !== null && this.state.showingChildrenOf.value;
        document.getElementById(tmp+"div") !== null && document.getElementById(tmp+"div").classList.remove("whiteBackground");

        //searching for arrow:
        /*let string = "div.FormGroup-EntityTypes";
        let el = document.querySelectorAll(string);
        let parent = this.state.showingChildrenOf !== null && this.state.showingChildrenOf.value;
        let node = null;
        el.forEach(function(item) {
            if(item.querySelectorAll("input[name='" + parent + "']").length === 1){
                node = item.querySelectorAll("input[name='" + parent + "']")[0];
            }
        });
        if(node !== null) { //if arrow found, rotate it for close
            //node.parentNode.querySelector("button span").classList.toggle('icon-expand-open');
        }*/
        this.setState({ //closing children
            showChildren: false,
            showingChildrenOf: null,
            filteredChildren: null
        })
    }

    handleChildrenSearch(e) {
        let tmp = e.target.value;
        if(tmp !== null && tmp !== "") {
            tmp = tmp.replace(/č/i, "c");
            tmp = tmp.replace(/ć/i, "c");
            tmp = tmp.replace(/š/i, "s");
            tmp = tmp.replace(/ž/i, "z");
            tmp = tmp.replace(/đ/i, "d");
            let filter = [];
            if (this.state.showingChildrenOf.children !== undefined && this.state.showingChildrenOf.children !== null && this.state.showingChildrenOf.children.length > 0) {
                filter = this.state.showingChildrenOf.children.filter(item => item.value.includes(tmp));
            } else {
                if (tmp !== null && tmp.trim() !== "") {
                    store.dispatch(filterConnectionTypesAutocomplete(this.state.showingChildrenOf.value, tmp));
                    this.unsubscribe = store.subscribe(() => {
                        filter = store.getState().rootReducer.reducer.connectionsTypeAutocompleteData.results;
                        if(store.getState().rootReducer.reducer.connectionsTypeAutocompleteData.total > number_per_page_by_db) {
                            this.setState({
                                more: true
                            });
                        }
                        const icon = <FontAwesomeIcon icon="check"/>;
                        filter.map((item, index) => {
                            item.icon = icon;
                            return item;
                        });
                    });
                }
            }
            setTimeout(() => {
                this.setState({
                    filteredChildren: filter
                });
            }, 500);
        }
        else {
            this.setState({
                filteredChildren: null
            })
        }
    }

    setCloseChildren() {
        /*this.setState({ //closing children
            showChildren: false,
            showingChildrenOf: null,
            filteredChildren: null
        });*/
        this.closeChildren();
        this.props.setCloseChildren(this.props.checkboxesGroupName);
    }

    componentWillUnmount() {
        try {
            this.unsubscribe();
        } catch (e) {
        }
    }

    render() {
        if((!this.props.openedChildren && this.props.closeChildren && this.state.showingChildrenOf !== null)) {
            this.setCloseChildren()
        }
        else if (((this.props.openedChildren === "entity_type" || this.props.openedChildren === "connection_type") && this.props.openedChildren !== this.props.checkboxesGroupName)
            && (this.state.showingChildrenOf && this.state.showingChildrenOf.value)){
            this.setCloseChildren()
        }
        const entityTypes =
            <div>
                {this.props.params.map((item, index) => {
                    return <div key={index} className={"checkboxDiv"} id={item.value+"div"}>
                        <input type="checkbox"
                            onChange={(e) => this.handleChecked(e)}
                            checked={(this.state.checkedParents.indexOf(item.value) < 0) ? false : true}
                            name={item.value}
                            id={item.value}
                            className={this.state.semiChecked === undefined || this.state.semiChecked.indexOf(item.value) < 0 ? "" : "semiChecked"}
                            />
                        <label htmlFor={item.value}>
                            <span><FontAwesomeIcon icon={"check"}/></span>
                            {item.label}
                        </label>
                        {item.children !== undefined ?
                            <button onClick={(e) => this.handleOpenChildren(e)} name={item.value} className={item.value}  style={{background: "transparent"}}>
                                <span className={"font-awesome-holder"}>
                                    <FontAwesomeIcon icon={"chevron-right"} className={"icon"} />
                                </span>
                            </button>
                            : null}
                    </div>
            })}
            </div>;
        const childrenDiv =
            <div className={ this.props.checkboxesGroupName === "entity_type" ? "Filter-childrenCheckboxes Filter-childrenCheckboxes-entityType" : "Filter-childrenCheckboxes"}>
                <div className={"Filter-childrenCheckboxes-header"}>
                    <span className={"Filter-childrenCheckboxes-Header-title"}>
                        {this.state.showingChildrenOf !== undefined && this.state.showingChildrenOf !== null && this.state.showingChildrenOf.label}
                    </span>
                    <button style={{background: "transparent", border: "none"}}
                            onClick={() => this.closeChildren()}>
                        {CLOSE} &nbsp;&nbsp;
                        <span className={"font-awesome-holder"}>
                                <FontAwesomeIcon icon={"times"}/>
                        </span>
                    </button>
                </div>
                <div className={"Filter-childrenCheckboxes-search"}
                     id={this.state.showingChildrenOf !== undefined && this.state.showingChildrenOf !== null && this.state.showingChildrenOf.label}>
                    <input name={"filter-children-search"}
                           onChange={(e) => this.handleChildrenSearch(e)}
                           placeholder={START_SEARCH}
                    key={this.state.showingChildrenOf !== undefined && this.state.showingChildrenOf !== null && this.state.showingChildrenOf.label}/>
                    <span className={"font-awesome-holder"}>
                        <FontAwesomeIcon icon="search"/>
                    </span>
                </div>
                <div className={"Filter-childrenCheckboxes-body"}>
                    {(this.state.filteredChildren !== undefined && this.state.filteredChildren !== null && this.state.filteredChildren.length > 0)
                        || (this.state.showChildren && this.state.showingChildrenOf !== undefined && this.state.showingChildrenOf !== null && this.state.showingChildrenOf.children !== undefined && this.state.showingChildrenOf.children !== null && this.state.showingChildrenOf.children.length > 0 )
                        ? ""
                            :
                            (this.state.filteredChildren === undefined || this.state.filteredChildren === null) ?
                                <div className={"checkboxDiv"}>
                                    {TOO_MANY_CONNECTIONS}
                                </div>
                                    : <div></div>}
                    {(this.state.filteredChildren !== undefined && this.state.filteredChildren !== null) ?
                        <div>
                            {this.state.filteredChildren.map((item, index) => {
                                let tmp = false;
                                if(this.state.checkedChildren[item.value + this.state.showingChildrenOf.value] !== undefined || this.state.checkedParents.indexOf(this.state.showingChildrenOf.value) > -1) {
                                    tmp = true;
                                }
                                return <div key={index} className={"checkboxDiv"}>
                                    <input type="checkbox"
                                           onChange={e => this.handleChildrenChecked(e)}
                                           checked={tmp}
                                           name={item.value}
                                           id={item.value}
                                           value={this.state.test}
                                    />
                                    <label htmlFor={item.value}>
                                        <span><FontAwesomeIcon icon={"check"}/></span>
                                        {item.label}
                                    </label>
                                </div>
                            })}
                            <span>{this.state.more ? MORE : ""}</span>
                        </div>
                        :
                            (this.state.showChildren && this.state.showingChildrenOf !== undefined && this.state.showingChildrenOf !== null && this.state.showingChildrenOf.children !== undefined && this.state.showingChildrenOf.children !== null ) ?
                                <div>
                                    {this.state.showingChildrenOf.children.map((item, index) => {
                                        let tmp = false;
                                        if(this.state.checkedChildren[item.value + this.state.showingChildrenOf.value] !== undefined || this.state.checkedParents.indexOf(this.state.showingChildrenOf.value) > -1) {
                                            tmp = true;
                                        }
                                        return <div key={index} className={"checkboxDiv"}>
                                            <input type="checkbox"
                                                   onChange={e => this.handleChildrenChecked(e)}
                                                   checked={tmp}
                                                   name={item.value}
                                                   id={item.value}
                                            />
                                            <label htmlFor={item.value}>
                                                <span><FontAwesomeIcon icon={"check"}/></span>
                                                {item.label}
                                            </label>
                                        </div>
                                    })}
                                    <span>{ store.getState().rootReducer.reducer.entityTypesLegalDataTotal > 100 && this.state.showingChildrenOf.value === "legal_entity" ? MORE : ""}</span>
                                </div>
                            :
                                ""}
                </div>
            </div>;
        return (
            <div>
                <div className={"FormGroup-EntityTypes"}>
                    {entityTypes}
                </div>
                <div className={"FilterChildren"}  style={{display: this.state.showChildren ? "block" : "none"}}>
                    {(this.state.showingChildrenOf !== undefined && this.state.showingChildrenOf !== null && this.state.showingChildrenOf.label) ? childrenDiv : null}
                </div>
            </div>
        )
    }
}
