import React, {Component} from 'react'
import {PERSONAL_DATA_EMAIL_CHANGED,
    PERSONAL_DATA_EMAIL_ERROR,
    PERSONAL_DATA_NAME,
    PERSONAL_DATA_LAST_NAME,
    PERSONAL_DATA_EMAIL_ERROR_NAME_TO_LONG,
    PERSONAL_DATA_EMAIL_ERROR_EMAIL_EXISTS,
    EMAIL,
    PERSONAL_DATA_EMAIL_ERROR_EMAIL_TO_LONG
} from "../lang";

export default class PersonalError extends Component {
    render() {
        let success = false;
        let fail = false;
        if(this.props.change && !this.props.error) {
            success = true;
        }
        if(this.props.change && this.props.error) {
            fail = true;
        }
        return (
            <div>
                {success &&
                    <div className={"Login-alert"} style={{color: "green"}}>{ PERSONAL_DATA_EMAIL_CHANGED }</div>
                }
                {fail &&
                (
                    <div className={"Login-alert"} style={{color: "red"}}>
                        { PERSONAL_DATA_EMAIL_ERROR }
                        {this.props.errors !== null && this.props.errors.first_name !== undefined ?
                        <span> {PERSONAL_DATA_NAME} : {this.props.errors.first_name[0] === "Ensure this field has no more than 30 characters." ? PERSONAL_DATA_EMAIL_ERROR_NAME_TO_LONG : this.props.results.first_name}</span>
                            : ""}
                        {this.props.errors !== null && this.props.errors.last_name !== undefined ?
                        <span> {PERSONAL_DATA_LAST_NAME} : {this.props.errors.last_name[0] === "Ensure this field has no more than 30 characters." ? PERSONAL_DATA_EMAIL_ERROR_NAME_TO_LONG : this.props.results.first_name}</span>
                            : ""}
                        {this.props.errors !== null && this.props.errors.email !== undefined ?
                        <span> {EMAIL} : {
                            this.props.errors.email[0] === "A user with that e-mail already exists." ?
                                    PERSONAL_DATA_EMAIL_ERROR_EMAIL_EXISTS
                                :
                                    this.props.errors.email[0] === "Ensure this field has no more than 254 characters." ?
                                        PERSONAL_DATA_EMAIL_ERROR_EMAIL_TO_LONG
                                        : this.props.results.first_name}</span>
                            : ""}
                    </div>
                )
                }
            </div>
        )
    }
}